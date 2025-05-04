import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrderItemsService } from '../services/order-items.service';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { FilterOrderItemDto } from '../dto/filter-order-item.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderItem } from '../entities/order-item.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery,
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Items de Órdenes')
@ApiBearerAuth('JWT-auth')
@Controller('orders/:orderId/items')
@UseGuards(JwtAuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({ summary: 'Añadir un item a una orden existente' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiCreatedResponse({ 
    description: 'Item añadido exitosamente',
    type: OrderItem 
  })
  @Post()
  async create(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto
  ): Promise<OrderItem> {
    return this.orderItemsService.create(orderId, createOrderItemDto);
  }

  @ApiOperation({ summary: 'Obtener todos los items de una orden' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiOkResponse({ 
    description: 'Lista de items de la orden',
    type: [OrderItem] 
  })
  @Get()
  async findAll(@Param('orderId') orderId: string): Promise<OrderItem[]> {
    return this.orderItemsService.findAll(orderId);
  }

  @ApiOperation({ summary: 'Obtener items de una orden con paginación y filtros' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'productId', required: false, type: String, description: 'Filtrar por ID de producto' })
  @ApiQuery({ name: 'minQuantity', required: false, type: Number, description: 'Filtrar por cantidad mínima' })
  @ApiQuery({ name: 'maxQuantity', required: false, type: Number, description: 'Filtrar por cantidad máxima' })
  @ApiQuery({ name: 'minUnitPrice', required: false, type: Number, description: 'Filtrar por precio unitario mínimo' })
  @ApiQuery({ name: 'maxUnitPrice', required: false, type: Number, description: 'Filtrar por precio unitario máximo' })
  @ApiOkResponse({ 
    description: 'Lista paginada de items de la orden',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderItem' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @Get('paginated')
  async findPaginated(
    @Param('orderId') orderId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
    @Query('minQuantity') minQuantity?: string,
    @Query('maxQuantity') maxQuantity?: string,
    @Query('minUnitPrice') minUnitPrice?: string,
    @Query('maxUnitPrice') maxUnitPrice?: string,
  ): Promise<{ data: OrderItem[]; total: number; page: number; limit: number }> {
    // Transformar parámetros
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterOrderItemDto = { 
      productId,
      minQuantity: minQuantity ? Number(minQuantity) : undefined,
      maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
      minUnitPrice: minUnitPrice ? Number(minUnitPrice) : undefined,
      maxUnitPrice: maxUnitPrice ? Number(maxUnitPrice) : undefined
    };
    
    return this.orderItemsService.findPaginated(orderId, paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un item específico de una orden' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiParam({ name: 'id', description: 'ID del item de la orden' })
  @ApiOkResponse({ 
    description: 'Item encontrado',
    type: OrderItem 
  })
  @Get(':id')
  async findOne(
    @Param('orderId') orderId: string,
    @Param('id') id: string
  ): Promise<OrderItem> {
    return this.orderItemsService.findOne(orderId, id);
  }

  @ApiOperation({ summary: 'Actualizar un item de una orden' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiParam({ name: 'id', description: 'ID del item a actualizar' })
  @ApiOkResponse({ 
    description: 'Item actualizado exitosamente',
    type: OrderItem 
  })
  @Patch(':id')
  async update(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ): Promise<OrderItem> {
    return this.orderItemsService.update(orderId, id, updateOrderItemDto);
  }

  @ApiOperation({ summary: 'Eliminar un item de una orden' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden' })
  @ApiParam({ name: 'id', description: 'ID del item a eliminar' })
  @ApiOkResponse({ description: 'Item eliminado exitosamente' })
  @Delete(':id')
  async remove(
    @Param('orderId') orderId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.orderItemsService.remove(orderId, id);
  }
} 