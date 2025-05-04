import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequestItem } from '../entities/order-request-item.entity';
import { OrderRequest } from '../entities/order-request.entity';
import { CreateOrderRequestItemDto } from '../dto/create-order-request-item.dto';
import { UpdateOrderRequestItemDto } from '../dto/update-order-request-item.dto';
import { FilterOrderRequestItemDto } from '../dto/filter-order-request-item.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class OrderRequestItemsService {
  constructor(
    @InjectRepository(OrderRequestItem)
    private readonly orderRequestItemRepository: Repository<OrderRequestItem>,
    @InjectRepository(OrderRequest)
    private readonly orderRequestRepository: Repository<OrderRequest>,
  ) {}

  async create(orderRequestId: string, createOrderRequestItemDto: CreateOrderRequestItemDto): Promise<OrderRequestItem> {
    // Verificar que la solicitud de orden existe
    const orderRequest = await this.orderRequestRepository.findOne({ where: { id: orderRequestId } });
    if (!orderRequest) {
      throw new NotFoundException(`Solicitud de orden con ID ${orderRequestId} no encontrada`);
    }

    try {
      // Calcular el subtotal
      const subtotal = createOrderRequestItemDto.quantity * createOrderRequestItemDto.unitPrice;

      // Crear el item de la solicitud
      const orderRequestItem = this.orderRequestItemRepository.create({
        orderRequestId,
        productId: createOrderRequestItemDto.productId,
        quantity: createOrderRequestItemDto.quantity,
        unitPrice: createOrderRequestItemDto.unitPrice,
        subtotal,
      });

      // Guardar el item
      const savedItem = await this.orderRequestItemRepository.save(orderRequestItem);

      // Actualizar el total de la solicitud
      await this.updateOrderRequestTotal(orderRequestId);

      return savedItem;
    } catch (error) {
      throw new BadRequestException(`Error al crear el item de la solicitud: ${error.message}`);
    }
  }

  async findAll(orderRequestId: string): Promise<OrderRequestItem[]> {
    // Verificar que la solicitud existe
    const orderRequest = await this.orderRequestRepository.findOne({ 
      where: { id: orderRequestId },
      relations: ['items', 'items.product']
    });
    
    if (!orderRequest) {
      throw new NotFoundException(`Solicitud de orden con ID ${orderRequestId} no encontrada`);
    }

    return orderRequest.items;
  }

  async findPaginated(
    orderRequestId: string,
    paginationDto: PaginationDto,
    filterDto: FilterOrderRequestItemDto,
  ): Promise<{ data: OrderRequestItem[]; total: number; page: number; limit: number }> {
    // Verificar que la solicitud de orden existe
    const orderRequest = await this.orderRequestRepository.findOne({ where: { id: orderRequestId } });
    if (!orderRequest) {
      throw new NotFoundException(`Solicitud de orden con ID ${orderRequestId} no encontrada`);
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    // Construir la consulta base
    const queryBuilder = this.orderRequestItemRepository.createQueryBuilder('orderRequestItem')
      .leftJoinAndSelect('orderRequestItem.product', 'product')
      .where('orderRequestItem.orderRequestId = :orderRequestId', { orderRequestId });

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.productId) {
        queryBuilder.andWhere('orderRequestItem.productId = :productId', { productId: filterDto.productId });
      }
      
      if (filterDto.minQuantity !== undefined && filterDto.maxQuantity !== undefined) {
        queryBuilder.andWhere('orderRequestItem.quantity BETWEEN :minQuantity AND :maxQuantity', {
          minQuantity: filterDto.minQuantity,
          maxQuantity: filterDto.maxQuantity,
        });
      } else if (filterDto.minQuantity !== undefined) {
        queryBuilder.andWhere('orderRequestItem.quantity >= :minQuantity', { minQuantity: filterDto.minQuantity });
      } else if (filterDto.maxQuantity !== undefined) {
        queryBuilder.andWhere('orderRequestItem.quantity <= :maxQuantity', { maxQuantity: filterDto.maxQuantity });
      }
      
      if (filterDto.minUnitPrice !== undefined && filterDto.maxUnitPrice !== undefined) {
        queryBuilder.andWhere('orderRequestItem.unitPrice BETWEEN :minUnitPrice AND :maxUnitPrice', {
          minUnitPrice: filterDto.minUnitPrice,
          maxUnitPrice: filterDto.maxUnitPrice,
        });
      } else if (filterDto.minUnitPrice !== undefined) {
        queryBuilder.andWhere('orderRequestItem.unitPrice >= :minUnitPrice', { minUnitPrice: filterDto.minUnitPrice });
      } else if (filterDto.maxUnitPrice !== undefined) {
        queryBuilder.andWhere('orderRequestItem.unitPrice <= :maxUnitPrice', { maxUnitPrice: filterDto.maxUnitPrice });
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

  async findOne(orderRequestId: string, itemId: string): Promise<OrderRequestItem> {
    const orderRequestItem = await this.orderRequestItemRepository.findOne({
      where: { id: itemId, orderRequestId },
      relations: ['product'],
    });

    if (!orderRequestItem) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado en la solicitud ${orderRequestId}`);
    }

    return orderRequestItem;
  }

  async update(orderRequestId: string, itemId: string, updateOrderRequestItemDto: UpdateOrderRequestItemDto): Promise<OrderRequestItem> {
    // Verificar que el item existe en la solicitud
    const orderRequestItem = await this.findOne(orderRequestId, itemId);

    try {
      // Actualizar campos
      if (updateOrderRequestItemDto.productId !== undefined) {
        orderRequestItem.productId = updateOrderRequestItemDto.productId;
      }
      
      if (updateOrderRequestItemDto.quantity !== undefined) {
        orderRequestItem.quantity = updateOrderRequestItemDto.quantity;
      }
      
      if (updateOrderRequestItemDto.unitPrice !== undefined) {
        orderRequestItem.unitPrice = updateOrderRequestItemDto.unitPrice;
      }

      // Recalcular subtotal si se cambió cantidad o precio
      if (updateOrderRequestItemDto.quantity !== undefined || updateOrderRequestItemDto.unitPrice !== undefined) {
        orderRequestItem.subtotal = orderRequestItem.quantity * orderRequestItem.unitPrice;
      }

      // Guardar cambios
      const updatedItem = await this.orderRequestItemRepository.save(orderRequestItem);

      // Actualizar el total de la solicitud
      await this.updateOrderRequestTotal(orderRequestId);

      return updatedItem;
    } catch (error) {
      throw new BadRequestException(`Error al actualizar el item de la solicitud: ${error.message}`);
    }
  }

  async remove(orderRequestId: string, itemId: string): Promise<void> {
    // Verificar que el item existe en la solicitud
    const orderRequestItem = await this.findOne(orderRequestId, itemId);

    // Eliminar el item
    await this.orderRequestItemRepository.remove(orderRequestItem);

    // Actualizar el total de la solicitud
    await this.updateOrderRequestTotal(orderRequestId);
  }

  private async updateOrderRequestTotal(orderRequestId: string): Promise<void> {
    // Obtener todos los items de la solicitud
    const items = await this.orderRequestItemRepository.find({ where: { orderRequestId } });
    
    // Calcular el nuevo total
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    
    // Actualizar el total en la solicitud
    await this.orderRequestRepository.update(orderRequestId, { total });
  }
} 