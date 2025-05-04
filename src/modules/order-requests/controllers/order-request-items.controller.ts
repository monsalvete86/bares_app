import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrderRequestItemsService } from '../services/order-request-items.service';
import { CreateOrderRequestItemDto } from '../dto/create-order-request-item.dto';
import { UpdateOrderRequestItemDto } from '../dto/update-order-request-item.dto';
import { FilterOrderRequestItemDto } from '../dto/filter-order-request-item.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderRequestItem } from '../entities/order-request-item.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery,
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Items de Solicitudes de Órdenes')
@ApiBearerAuth('JWT-auth')
@Controller('order-requests/:orderRequestId/items')
@UseGuards(JwtAuthGuard)
export class OrderRequestItemsController {
  constructor(private readonly orderRequestItemsService: OrderRequestItemsService) {}

  @ApiOperation({ summary: 'Crear un nuevo item en una solicitud de orden' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiCreatedResponse({ 
    description: 'Item creado exitosamente',
    type: OrderRequestItem 
  })
  @Post()
  async create(
    @Param('orderRequestId') orderRequestId: string,
    @Body() createOrderRequestItemDto: CreateOrderRequestItemDto
  ): Promise<OrderRequestItem> {
    return this.orderRequestItemsService.create(orderRequestId, createOrderRequestItemDto);
  }

  @ApiOperation({ summary: 'Obtener todos los items de una solicitud de orden' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiOkResponse({ 
    description: 'Lista de items de la solicitud',
    type: [OrderRequestItem] 
  })
  @Get()
  async findAll(@Param('orderRequestId') orderRequestId: string): Promise<OrderRequestItem[]> {
    return this.orderRequestItemsService.findAll(orderRequestId);
  }

  @ApiOperation({ summary: 'Obtener items de una solicitud de orden con paginación y filtros' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de elementos por página', type: Number })
  @ApiQuery({ name: 'productId', required: false, description: 'Filtrar por ID de producto', type: String })
  @ApiQuery({ name: 'minQuantity', required: false, description: 'Cantidad mínima', type: Number })
  @ApiQuery({ name: 'maxQuantity', required: false, description: 'Cantidad máxima', type: Number })
  @ApiQuery({ name: 'minUnitPrice', required: false, description: 'Precio unitario mínimo', type: Number })
  @ApiQuery({ name: 'maxUnitPrice', required: false, description: 'Precio unitario máximo', type: Number })
  @ApiOkResponse({ 
    description: 'Lista paginada de items de la solicitud',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderRequestItem' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @Get('paginated')
  async findPaginated(
    @Param('orderRequestId') orderRequestId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
    @Query('minQuantity') minQuantity?: string,
    @Query('maxQuantity') maxQuantity?: string,
    @Query('minUnitPrice') minUnitPrice?: string,
    @Query('maxUnitPrice') maxUnitPrice?: string,
  ): Promise<{ data: OrderRequestItem[]; total: number; page: number; limit: number }> {
    // Transformar parámetros
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterOrderRequestItemDto = { 
      productId,
      minQuantity: minQuantity ? Number(minQuantity) : undefined,
      maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
      minUnitPrice: minUnitPrice ? Number(minUnitPrice) : undefined,
      maxUnitPrice: maxUnitPrice ? Number(maxUnitPrice) : undefined
    };
    
    return this.orderRequestItemsService.findPaginated(orderRequestId, paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un item específico de una solicitud de orden' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiParam({ name: 'id', description: 'ID del item de la solicitud' })
  @ApiOkResponse({ 
    description: 'Item encontrado',
    type: OrderRequestItem 
  })
  @Get(':id')
  async findOne(
    @Param('orderRequestId') orderRequestId: string,
    @Param('id') id: string
  ): Promise<OrderRequestItem> {
    return this.orderRequestItemsService.findOne(orderRequestId, id);
  }

  @ApiOperation({ summary: 'Actualizar un item de una solicitud de orden' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiParam({ name: 'id', description: 'ID del item a actualizar' })
  @ApiOkResponse({ 
    description: 'Item actualizado',
    type: OrderRequestItem 
  })
  @Patch(':id')
  async update(
    @Param('orderRequestId') orderRequestId: string,
    @Param('id') id: string,
    @Body() updateOrderRequestItemDto: UpdateOrderRequestItemDto
  ): Promise<OrderRequestItem> {
    return this.orderRequestItemsService.update(orderRequestId, id, updateOrderRequestItemDto);
  }

  @ApiOperation({ summary: 'Eliminar un item de una solicitud de orden' })
  @ApiParam({ name: 'orderRequestId', description: 'ID de la solicitud de orden' })
  @ApiParam({ name: 'id', description: 'ID del item a eliminar' })
  @ApiOkResponse({ description: 'Item eliminado correctamente' })
  @Delete(':id')
  async remove(
    @Param('orderRequestId') orderRequestId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.orderRequestItemsService.remove(orderRequestId, id);
  }
} 