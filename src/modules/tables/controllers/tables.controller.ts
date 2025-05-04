import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TablesService } from '../services/tables.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { FilterTableDto } from '../dto/filter-table.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Table } from '../entities/table.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Mesas')
@ApiBearerAuth('JWT-auth')
@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiOperation({ summary: 'Crear nueva mesa' })
  @ApiCreatedResponse({ 
    description: 'Mesa creada exitosamente',
    type: Table 
  })
  @Post()
  async create(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return this.tablesService.create(createTableDto);
  }

  @ApiOperation({ summary: 'Obtener todas las mesas' })
  @ApiOkResponse({ 
    description: 'Lista de todas las mesas',
    type: [Table] 
  })
  @Get()
  async findAll(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener mesas paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'number', required: false, type: Number, description: 'Filtrar por número de mesa' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrar por nombre de mesa' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Filtrar por descripción de mesa' })
  @ApiQuery({ 
    name: 'isOccupied', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado de ocupación',
    schema: {
      type: 'boolean'
    }
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado (activa/inactiva)',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de mesas',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Table' }
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
    @Query('number') number?: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('isOccupied') isOccupied?: string,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterTableDto = { 
      number: number ? Number(number) : undefined, 
      name, 
      description,
      isOccupied: isOccupied === 'true' ? true : isOccupied === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    };
    
    return this.tablesService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una mesa por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mesa' })
  @ApiOkResponse({ 
    description: 'Mesa encontrada',
    type: Table 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Table> {
    return this.tablesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una mesa' })
  @ApiParam({ name: 'id', description: 'ID de la mesa a actualizar' })
  @ApiOkResponse({ 
    description: 'Mesa actualizada exitosamente',
    type: Table 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto): Promise<Table> {
    return this.tablesService.update(id, updateTableDto);
  }

  @ApiOperation({ summary: 'Cambiar estado de ocupación de una mesa' })
  @ApiParam({ name: 'id', description: 'ID de la mesa' })
  @ApiQuery({ 
    name: 'isOccupied', 
    required: true, 
    type: Boolean, 
    description: 'Estado de ocupación (true: ocupada, false: disponible)' 
  })
  @ApiOkResponse({ 
    description: 'Estado de ocupación actualizado exitosamente',
    type: Table 
  })
  @Patch(':id/occupation')
  async changeOccupiedStatus(
    @Param('id') id: string,
    @Query('isOccupied') isOccupied: string
  ): Promise<Table> {
    const isOccupiedBool = isOccupied === 'true';
    return this.tablesService.changeOccupiedStatus(id, isOccupiedBool);
  }

  @ApiOperation({ summary: 'Eliminar una mesa' })
  @ApiParam({ name: 'id', description: 'ID de la mesa a eliminar' })
  @ApiOkResponse({ description: 'Mesa eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tablesService.remove(id);
  }
} 