import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrderRequestsService } from '../services/order-requests.service';
import { CreateOrderRequestDto } from '../dto/create-order-request.dto';
import { UpdateOrderRequestDto } from '../dto/update-order-request.dto';
import { FilterOrderRequestDto } from '../dto/filter-order-request.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderRequest } from '../entities/order-request.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Solicitudes de Órdenes')
@ApiBearerAuth('JWT-auth')
@Controller('order-requests')
@UseGuards(JwtAuthGuard)
export class OrderRequestsController {
  constructor(private readonly orderRequestsService: OrderRequestsService) {}

  @ApiOperation({ summary: 'Crear una nueva solicitud de orden' })
  @ApiCreatedResponse({ 
    description: 'Solicitud de orden creada exitosamente',
    type: OrderRequest 
  })
  @Post()
  async create(@Body() createOrderRequestDto: CreateOrderRequestDto): Promise<OrderRequest> {
    return this.orderRequestsService.create(createOrderRequestDto);
  }

  @ApiOperation({ summary: 'Obtener todas las solicitudes de órdenes' })
  @ApiOkResponse({ 
    description: 'Lista de todas las solicitudes de órdenes',
    type: [OrderRequest] 
  })
  @Get()
  async findAll(): Promise<OrderRequest[]> {
    return this.orderRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener solicitudes de órdenes paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'Filtrar por ID de mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ 
    name: 'createdFrom', 
    required: false, 
    type: String, 
    description: 'Filtrar por fecha de creación (desde) - Formato: YYYY-MM-DD'
  })
  @ApiQuery({ 
    name: 'createdTo', 
    required: false, 
    type: String, 
    description: 'Filtrar por fecha de creación (hasta) - Formato: YYYY-MM-DD'
  })
  @ApiQuery({ 
    name: 'isCompleted', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado completado/pendiente',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de solicitudes de órdenes',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderRequest' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @Get('paginated')
  async findPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tableId') tableId?: string,
    @Query('clientId') clientId?: string,
    @Query('createdFrom') createdFrom?: string,
    @Query('createdTo') createdTo?: string,
    @Query('isCompleted') isCompleted?: string,
  ): Promise<{ data: OrderRequest[]; total: number; page: number; limit: number }> {
    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterOrderRequestDto = { 
      tableId, 
      clientId, 
      createdFrom,
      createdTo,
      isCompleted: isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined
    };
    
    return this.orderRequestsService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una solicitud de orden por ID' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de orden' })
  @ApiOkResponse({ 
    description: 'Solicitud de orden encontrada',
    type: OrderRequest 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderRequest> {
    return this.orderRequestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una solicitud de orden' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de orden a actualizar' })
  @ApiOkResponse({ 
    description: 'Solicitud de orden actualizada exitosamente',
    type: OrderRequest 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderRequestDto: UpdateOrderRequestDto): Promise<OrderRequest> {
    return this.orderRequestsService.update(id, updateOrderRequestDto);
  }

  @ApiOperation({ summary: 'Marcar una solicitud de orden como completada' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de orden a completar' })
  @ApiOkResponse({ 
    description: 'Solicitud de orden marcada como completada',
    type: OrderRequest 
  })
  @Patch(':id/complete')
  async completeOrderRequest(@Param('id') id: string): Promise<OrderRequest> {
    return this.orderRequestsService.completeOrderRequest(id);
  }

  @ApiOperation({ summary: 'Eliminar una solicitud de orden' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de orden a eliminar' })
  @ApiOkResponse({ description: 'Solicitud de orden eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderRequestsService.remove(id);
  }
} 