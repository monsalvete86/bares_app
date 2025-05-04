import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
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
        const savedItems = await this.orderItemRepository.save(orderItems);
        savedOrder.items = savedItems;

        // Calcular el total de la orden
        const total = savedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
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

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'table', 'client'],
    });
  }

  async findPaginated(
    paginationDto: PaginationDto,
    filterDto: FilterOrderDto,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
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

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'table', 'client'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

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
        const savedItems = await this.orderItemRepository.save(orderItems);
        
        // Calcular el nuevo total
        const total = savedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
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
    const order = await this.findOne(id);

    // Eliminar los items de la orden
    await this.orderItemRepository.delete({ orderId: id });
    
    // Eliminar la orden
    await this.orderRepository.remove(order);
  }
} 