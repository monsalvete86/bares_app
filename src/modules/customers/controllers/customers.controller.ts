import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { FilterCustomerDto } from '../dto/filter-customer.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Customer } from '../entities/customer.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'No autorizado - JWT no válido o expirado',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Crear nuevo cliente' })
  @ApiCreatedResponse({
    description: 'Cliente creado exitosamente',
    type: Customer,
  })
  @ApiConflictResponse({ description: 'La mesa especificada no existe' })
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiOkResponse({
    description: 'Lista de todos los clientes',
    type: [Customer],
  })
  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener clientes paginados con filtros' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Límite de registros por página',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filtrar por nombre del cliente',
    example: 'Juan',
  })
  @ApiQuery({
    name: 'tableId',
    required: false,
    type: String,
    description: 'Filtrar por ID de mesa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filtrar por estado (activo/inactivo)',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiOkResponse({
    description: 'Lista paginada de clientes',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Customer' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  @Get('paginated')
  async findPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('tableId') tableId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const paginationDto: PaginationDto = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const filterDto: FilterCustomerDto = {
      name,
      tableId,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    };

    return this.customersService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Cliente encontrado',
    type: Customer,
  })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Cliente actualizado exitosamente',
    type: Customer,
  })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @ApiConflictResponse({ description: 'La mesa especificada no existe' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Cliente eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
