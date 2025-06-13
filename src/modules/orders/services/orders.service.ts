import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto, OrderStatus } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { GroupedOrderItemDto } from '../dto/grouped-order-item.dto';
import { OrderDetailDto } from '../dto/order-detail.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDetailDto> {
    try {
      // Crear la orden
      const order = this.orderRepository.create({
        tableId: createOrderDto.tableId,
        clientId: createOrderDto.clientId,
        status: createOrderDto.status,
        isActive: createOrderDto.isActive ?? true,
        total: 0, // Se calculará después
      });

      // Guardar la orden para obtener un ID
      const savedOrder = await this.orderRepository.save(order);

      // Crear y guardar los items
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        const orderItems = createOrderDto.items.map(itemDto => {
          const subtotal = itemDto.quantity * itemDto.unitPrice;
          return this.orderItemRepository.create({
            orderId: savedOrder.id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
            subtotal: subtotal,
          });
        });

        // Guardar los items
        await this.orderItemRepository.save(orderItems);

        // Calcular el total de la orden
        const total = orderItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
        savedOrder.total = total;

        // Actualizar la orden con el total
        await this.orderRepository.update(savedOrder.id, { total });
      }

      // Devolver la orden completa con items
      return this.findOne(savedOrder.id);
    } catch (error) {
      throw new BadRequestException(`Error al crear la orden: ${error.message}`);
    }
  }

  async findAll(): Promise<OrderDetailDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['items', 'items.product', 'table', 'client'],
    });

    return Promise.all(orders.map(order => this.mapOrderToDetailDto(order)));
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterDto: FilterOrderDto,
  ): Promise<{ data: OrderDetailDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.client', 'client');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.tableId) {
        queryBuilder.andWhere('order.tableId = :tableId', { tableId: filterDto.tableId });
      }
      if (filterDto.clientId) {
        queryBuilder.andWhere('order.clientId = :clientId', { clientId: filterDto.clientId });
      }
      if (filterDto.status) {
        queryBuilder.andWhere('order.status = :status', { status: filterDto.status });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('order.isActive = :isActive', { isActive: filterDto.isActive });
      }
      
      // Filtros de fecha
      if (filterDto.createdFrom && filterDto.createdTo) {
        queryBuilder.andWhere('order.createdAt BETWEEN :createdFrom AND :createdTo', {
          createdFrom: new Date(filterDto.createdFrom),
          createdTo: new Date(filterDto.createdTo),
        });
      } else if (filterDto.createdFrom) {
        queryBuilder.andWhere('order.createdAt >= :createdFrom', {
          createdFrom: new Date(filterDto.createdFrom),
        });
      } else if (filterDto.createdTo) {
        queryBuilder.andWhere('order.createdAt <= :createdTo', {
          createdTo: new Date(filterDto.createdTo),
        });
      }
    }

    // Ordenar por fecha de creación (más reciente primero)
    queryBuilder.orderBy('order.createdAt', 'DESC');

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const detailedOrders = await Promise.all(data.map(order => this.mapOrderToDetailDto(order)));

    return {
      data: detailedOrders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<OrderDetailDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'table', 'client'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return this.mapOrderToDetailDto(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDetailDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'table', 'client'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    try {
      // Actualizar campos básicos de la orden
      if (updateOrderDto.tableId !== undefined) order.tableId = updateOrderDto.tableId;
      if (updateOrderDto.clientId !== undefined) order.clientId = updateOrderDto.clientId;
      if (updateOrderDto.status !== undefined) order.status = updateOrderDto.status;
      if (updateOrderDto.isActive !== undefined) order.isActive = updateOrderDto.isActive;

      // Si hay items para actualizar
      if (updateOrderDto.items && updateOrderDto.items.length > 0) {
        // Eliminar items existentes
        await this.orderItemRepository.delete({ orderId: id });

        // Crear nuevos items
        const orderItems = updateOrderDto.items.map(itemDto => {
          const subtotal = itemDto.quantity * itemDto.unitPrice;
          return this.orderItemRepository.create({
            orderId: id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
            subtotal: subtotal,
          });
        });

        // Guardar los nuevos items
        await this.orderItemRepository.save(orderItems);
        
        // Calcular el nuevo total
        const total = orderItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
        order.total = total;
      }

      // Guardar la orden actualizada
      await this.orderRepository.save(order);

      // Devolver la orden actualizada con sus relaciones
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(`Error al actualizar la orden: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Eliminar los items de la orden
    await this.orderItemRepository.delete({ orderId: id });
    
    // Eliminar la orden
    await this.orderRepository.remove(order);
  }

  /**
   * Agrupa los items de una orden por producto y devuelve un array de items agrupados
   */
  private groupOrderItemsByProduct(orderItems: OrderItem[]): GroupedOrderItemDto[] {
    const groupedMap = new Map<string, GroupedOrderItemDto>();

    orderItems.forEach(item => {
      const productId = item.productId;
      
      if (!groupedMap.has(productId)) {
        groupedMap.set(productId, {
          productId,
          product: item.product,
          totalQuantity: 0,
          unitPrice: Number(item.unitPrice),
          subtotal: 0,
          itemIds: [],
        });
      }
      
      const group = groupedMap.get(productId);
      if (group) {
        group.totalQuantity += item.quantity;
        group.subtotal += Number(item.subtotal);
        group.itemIds.push(item.id);
      }
    });

    return Array.from(groupedMap.values());
  }

  /**
   * Mapea una entidad Order al DTO OrderDetailDto con items agrupados
   */
  private mapOrderToDetailDto(order: Order): OrderDetailDto {
    const groupedItems = this.groupOrderItemsByProduct(order.items);

    const orderDetailDto: OrderDetailDto = {
      id: order.id,
      tableId: order.tableId,
      table: order.table,
      clientId: order.clientId,
      client: order.client,
      groupedItems,
      total: Number(order.total),
      status: order.status as OrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      isActive: order.isActive
    };

    return orderDetailDto;
  }
} 