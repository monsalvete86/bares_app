import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, OrderStatus } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Order } from '../entities/order.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Órdenes')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiCreatedResponse({ 
    description: 'Orden creada exitosamente',
    type: Order 
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiOkResponse({ 
    description: 'Lista de todas las órdenes',
    type: [Order] 
  })
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener órdenes paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'Filtrar por ID de mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: OrderStatus, 
    description: 'Filtrar por estado de la orden',
    schema: { 
      type: 'string',
      enum: Object.values(OrderStatus)
    }
  })
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
    name: 'isActive', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado (activo/inactivo)',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de órdenes',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Order' }
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
    @Query('status') status?: OrderStatus,
    @Query('createdFrom') createdFrom?: string,
    @Query('createdTo') createdTo?: string,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterOrderDto = { 
      tableId, 
      clientId, 
      status, 
      createdFrom,
      createdTo,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    };
    
    return this.ordersService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiOkResponse({ 
    description: 'Orden encontrada',
    type: Order 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden a actualizar' })
  @ApiOkResponse({ 
    description: 'Orden actualizada exitosamente',
    type: Order 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden a eliminar' })
  @ApiOkResponse({ description: 'Orden eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
} 