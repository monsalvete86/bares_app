import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { FilterOrderItemDto } from '../dto/filter-order-item.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(orderId: string, createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    try {
      // Calcular el subtotal
      const subtotal = createOrderItemDto.quantity * createOrderItemDto.unitPrice;

      // Crear el item de la orden
      const orderItem = this.orderItemRepository.create({
        orderId,
        productId: createOrderItemDto.productId,
        quantity: createOrderItemDto.quantity,
        unitPrice: createOrderItemDto.unitPrice,
        subtotal,
      });

      // Guardar el item
      const savedItem = await this.orderItemRepository.save(orderItem);

      // Actualizar el total de la orden
      await this.updateOrderTotal(orderId);

      return savedItem;
    } catch (error) {
      throw new BadRequestException(`Error al crear el item de la orden: ${error.message}`);
    }
  }

  async findAll(orderId: string): Promise<OrderItem[]> {
    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ['items', 'items.product']
    });
    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    return order.items;
  }

  async findPaginated(
    orderId: string,
    paginationDto: PaginationDto,
    filterDto: FilterOrderItemDto,
  ): Promise<{ data: OrderItem[]; total: number; page: number; limit: number }> {
    // Verificar que la orden existe
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Construir la consulta base
    const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('orderItem.orderId = :orderId', { orderId });

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.productId) {
        queryBuilder.andWhere('orderItem.productId = :productId', { productId: filterDto.productId });
      }
      
      if (filterDto.minQuantity !== undefined && filterDto.maxQuantity !== undefined) {
        queryBuilder.andWhere('orderItem.quantity BETWEEN :minQuantity AND :maxQuantity', {
          minQuantity: filterDto.minQuantity,
          maxQuantity: filterDto.maxQuantity,
        });
      } else if (filterDto.minQuantity !== undefined) {
        queryBuilder.andWhere('orderItem.quantity >= :minQuantity', { minQuantity: filterDto.minQuantity });
      } else if (filterDto.maxQuantity !== undefined) {
        queryBuilder.andWhere('orderItem.quantity <= :maxQuantity', { maxQuantity: filterDto.maxQuantity });
      }
      
      if (filterDto.minUnitPrice !== undefined && filterDto.maxUnitPrice !== undefined) {
        queryBuilder.andWhere('orderItem.unitPrice BETWEEN :minUnitPrice AND :maxUnitPrice', {
          minUnitPrice: filterDto.minUnitPrice,
          maxUnitPrice: filterDto.maxUnitPrice,
        });
      } else if (filterDto.minUnitPrice !== undefined) {
        queryBuilder.andWhere('orderItem.unitPrice >= :minUnitPrice', { minUnitPrice: filterDto.minUnitPrice });
      } else if (filterDto.maxUnitPrice !== undefined) {
        queryBuilder.andWhere('orderItem.unitPrice <= :maxUnitPrice', { maxUnitPrice: filterDto.maxUnitPrice });
      }
    }

    // Ejecutar la consulta con paginación
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

  async findOne(orderId: string, itemId: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: itemId, orderId },
      relations: ['product'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado en la orden ${orderId}`);
    }

    return orderItem;
  }

  async update(orderId: string, itemId: string, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    // Verificar que el item existe en la orden
    const orderItem = await this.findOne(orderId, itemId);

    try {
      // Actualizar campos
      if (updateOrderItemDto.productId !== undefined) {
        orderItem.productId = updateOrderItemDto.productId;
      }
      
      if (updateOrderItemDto.quantity !== undefined) {
        orderItem.quantity = updateOrderItemDto.quantity;
      }
      
      if (updateOrderItemDto.unitPrice !== undefined) {
        orderItem.unitPrice = updateOrderItemDto.unitPrice;
      }

      // Recalcular subtotal si se cambió cantidad o precio
      if (updateOrderItemDto.quantity !== undefined || updateOrderItemDto.unitPrice !== undefined) {
        orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
      }

      // Guardar cambios
      const updatedItem = await this.orderItemRepository.save(orderItem);

      // Actualizar el total de la orden
      await this.updateOrderTotal(orderId);

      return updatedItem;
    } catch (error) {
      throw new BadRequestException(`Error al actualizar el item de la orden: ${error.message}`);
    }
  }

  async remove(orderId: string, itemId: string): Promise<void> {
    // Verificar que el item existe en la orden
    const orderItem = await this.findOne(orderId, itemId);

    // Eliminar el item
    await this.orderItemRepository.remove(orderItem);

    // Actualizar el total de la orden
    await this.updateOrderTotal(orderId);
  }

  // Método privado para actualizar el total de la orden
  private async updateOrderTotal(orderId: string): Promise<void> {
    // Obtener todos los items de la orden
    const items = await this.orderItemRepository.find({ where: { orderId } });
    
    // Calcular el nuevo total
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    
    // Actualizar la orden
    await this.orderRepository.update(orderId, { total });
  }
} 