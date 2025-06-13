import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequest } from '../entities/order-request.entity';
import { OrderRequestItem } from '../entities/order-request-item.entity';
import { CreateOrderRequestDto } from '../dto/create-order-request.dto';
import { UpdateOrderRequestDto } from '../dto/update-order-request.dto';
import { FilterOrderRequestDto } from '../dto/filter-order-request.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { WebsocketsService } from '../../websockets/services/websockets.service';
import { OrdersService } from '../../orders/services/orders.service';
import { CreateOrderDto, OrderStatus } from '../../orders/dto/create-order.dto';
import { CreateOrderItemDto } from '../../orders/dto/create-order-item.dto';

@Injectable()
export class OrderRequestsService {
  constructor(
    @InjectRepository(OrderRequest)
    private readonly orderRequestRepository: Repository<OrderRequest>,
    @InjectRepository(OrderRequestItem)
    private readonly orderRequestItemRepository: Repository<OrderRequestItem>,
    private readonly websocketsService: WebsocketsService,
    private readonly ordersService: OrdersService,
  ) {}

  async create(createOrderRequestDto: CreateOrderRequestDto): Promise<OrderRequest> {
    try {
      // Crear la solicitud de orden
      const orderRequest = this.orderRequestRepository.create({
        tableId: createOrderRequestDto.tableId,
        clientId: createOrderRequestDto.clientId,
        isCompleted: false,
        total: 0, // Se calculará después
      });

      // Guardar la solicitud para obtener un ID
      const savedOrderRequest = await this.orderRequestRepository.save(orderRequest);

      // Crear y guardar los items
      if (createOrderRequestDto.items && createOrderRequestDto.items.length > 0) {
        const orderRequestItems = createOrderRequestDto.items.map(itemDto => {
          const subtotal = itemDto.quantity * itemDto.unitPrice;
          return this.orderRequestItemRepository.create({
            orderRequestId: savedOrderRequest.id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
            subtotal: subtotal,
          });
        });

        // Guardar los items
        const savedItems = await this.orderRequestItemRepository.save(orderRequestItems);
        savedOrderRequest.items = savedItems;

        // Calcular el total de la solicitud
        const total = savedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
        savedOrderRequest.total = total;

        // Actualizar la solicitud con el total
        await this.orderRequestRepository.update(savedOrderRequest.id, { total });
      }

      // Obtener la solicitud completa con items
      const completeOrderRequest = await this.findOne(savedOrderRequest.id);

      // Notificar sobre el nuevo pedido a través de WebSockets
      this.websocketsService.notifyNewOrder(
        completeOrderRequest.id,
        completeOrderRequest.tableId,
        completeOrderRequest.clientId,
        {
          total: Number(completeOrderRequest.total),
          itemsCount: completeOrderRequest.items ? completeOrderRequest.items.length : 0,
          createdAt: completeOrderRequest.createdAt,
        }
      );

      // Actualizar también el listado completo de órdenes para la mesa
      const tableOrderRequests = await this.orderRequestRepository.find({
        where: { tableId: completeOrderRequest.tableId, isCompleted: false },
        relations: ['items', 'items.product'],
      });
      this.websocketsService.notifyOrderRequestUpdate(completeOrderRequest.tableId, tableOrderRequests);

      return completeOrderRequest;
    } catch (error) {
      throw new BadRequestException(`Error al crear la solicitud de orden: ${error.message}`);
    }
  }

  async findAll(): Promise<OrderRequest[]> {
    return this.orderRequestRepository.find({
      relations: ['items', 'items.product', 'table', 'client'],
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterDto: FilterOrderRequestDto,
  ): Promise<{ data: OrderRequest[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRequestRepository.createQueryBuilder('orderRequest')
      .leftJoinAndSelect('orderRequest.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('orderRequest.table', 'table')
      .leftJoinAndSelect('orderRequest.client', 'client');

    // Aplicar filtros si están presentes
    if (filterDto.tableId) {
      queryBuilder.andWhere('orderRequest.tableId = :tableId', { tableId: filterDto.tableId });
    }

    if (filterDto.clientId) {
      queryBuilder.andWhere('orderRequest.clientId = :clientId', { clientId: filterDto.clientId });
    }

    if (filterDto.isCompleted !== undefined) {
      queryBuilder.andWhere('orderRequest.isCompleted = :isCompleted', { isCompleted: filterDto.isCompleted });
    }

    if (filterDto.createdFrom) {
      const fromDate = new Date(filterDto.createdFrom);
      fromDate.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('orderRequest.createdAt >= :fromDate', { fromDate });
    }

    if (filterDto.createdTo) {
      const toDate = new Date(filterDto.createdTo);
      toDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('orderRequest.createdAt <= :toDate', { toDate });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<OrderRequest> {
    const orderRequest = await this.orderRequestRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'table', 'client'],
    });

    if (!orderRequest) {
      throw new NotFoundException(`Solicitud de orden con ID ${id} no encontrada`);
    }

    return orderRequest;
  }

  async update(id: string, updateOrderRequestDto: UpdateOrderRequestDto): Promise<OrderRequest> {
    const orderRequest = await this.findOne(id);

    try {
      // Actualizar campos básicos de la solicitud
      if (updateOrderRequestDto.tableId !== undefined) orderRequest.tableId = updateOrderRequestDto.tableId;
      if (updateOrderRequestDto.clientId !== undefined) orderRequest.clientId = updateOrderRequestDto.clientId;

      // Si hay items para actualizar
      if (updateOrderRequestDto.items && updateOrderRequestDto.items.length > 0) {
        // Eliminar items existentes
        await this.orderRequestItemRepository.delete({ orderRequestId: id });

        // Crear nuevos items
        const orderRequestItems = updateOrderRequestDto.items.map(itemDto => {
          const subtotal = itemDto.quantity * itemDto.unitPrice;
          return this.orderRequestItemRepository.create({
            orderRequestId: id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
            subtotal: subtotal,
          });
        });

        // Guardar los nuevos items
        const savedItems = await this.orderRequestItemRepository.save(orderRequestItems);
        
        // Calcular el nuevo total
        const total = savedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
        orderRequest.total = total;
      }

      // Guardar la solicitud actualizada
      await this.orderRequestRepository.save(orderRequest);

      // Obtener la solicitud actualizada con sus relaciones
      const updatedOrderRequest = await this.findOne(id);

      // Notificar sobre la actualización del pedido a través de WebSockets
      this.websocketsService.notifyOrderRequestUpdate(updatedOrderRequest.tableId, [updatedOrderRequest]);

      return updatedOrderRequest;
    } catch (error) {
      throw new BadRequestException(`Error al actualizar la solicitud de orden: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const orderRequest = await this.findOne(id);

    // Eliminar los items de la solicitud
    await this.orderRequestItemRepository.delete({ orderRequestId: id });
    
    // Eliminar la solicitud
    await this.orderRequestRepository.remove(orderRequest);
  }

  async completeOrderRequest(id: string): Promise<OrderRequest> {
    const orderRequest = await this.findOne(id);
    
    if (orderRequest.isCompleted) {
      throw new BadRequestException('La solicitud de orden ya está completada');
    }
    
    orderRequest.isCompleted = true;
    const updatedOrderRequest = await this.orderRequestRepository.save(orderRequest);

    // Actualizar el listado completo de órdenes para la mesa a través de WebSockets
    const tableOrderRequests = await this.orderRequestRepository.find({
      where: { tableId: orderRequest.tableId, isCompleted: false },
      relations: ['items', 'items.product'],
    });
    this.websocketsService.notifyOrderRequestUpdate(orderRequest.tableId, tableOrderRequests);

    return updatedOrderRequest;
  }

  async acceptOrderRequest(id: string) {
    // Obtener la solicitud de orden con sus items
    const orderRequest = await this.findOne(id);
    
    if (orderRequest.isCompleted) {
      throw new BadRequestException('La solicitud de orden ya está completada');
    }

    if (!orderRequest.items || orderRequest.items.length === 0) {
      throw new BadRequestException('La solicitud de orden no tiene items');
    }

    try {
      // Convertir OrderRequestItems a OrderItems (para CreateOrderDto)
      const orderItems: CreateOrderItemDto[] = orderRequest.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      }));

      // Crear el DTO para la nueva orden
      const createOrderDto: CreateOrderDto = {
        tableId: orderRequest.tableId,
        clientId: orderRequest.clientId,
        items: orderItems,
        status: OrderStatus.PROCESSING, // Establecer estado inicial como "processing"
        isActive: true
      };

      // Crear la nueva orden usando el servicio de órdenes
      const newOrder = await this.ordersService.create(createOrderDto);

      // Marcar la solicitud de orden como completada
      orderRequest.isCompleted = true;
      const updatedOrderRequest = await this.orderRequestRepository.save(orderRequest);

      // Actualizar el listado completo de órdenes para la mesa a través de WebSockets
      const tableOrderRequests = await this.orderRequestRepository.find({
        where: { tableId: orderRequest.tableId, isCompleted: false },
        relations: ['items', 'items.product'],
      });
      this.websocketsService.notifyOrderRequestUpdate(orderRequest.tableId, tableOrderRequests);

      // Devolver tanto la solicitud actualizada como la nueva orden
      return {
        orderRequest: updatedOrderRequest,
        order: newOrder
      };
    } catch (error) {
      throw new BadRequestException(`Error al aceptar la solicitud de orden: ${error.message}`);
    }
  }
} 