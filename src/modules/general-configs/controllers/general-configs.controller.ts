import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GeneralConfigsService } from '../services/general-configs.service';
import { CreateGeneralConfigDto } from '../dto/create-general-config.dto';
import { UpdateGeneralConfigDto } from '../dto/update-general-config.dto';
import { FilterGeneralConfigDto } from '../dto/filter-general-config.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GeneralConfig } from '../entities/general-config.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Configuración General')
@ApiBearerAuth('JWT-auth')
@Controller('general-configs')
@UseGuards(JwtAuthGuard)
export class GeneralConfigsController {
  constructor(private readonly generalConfigsService: GeneralConfigsService) {}

  @ApiOperation({ summary: 'Crear nueva configuración general' })
  @ApiCreatedResponse({ 
    description: 'Configuración general creada exitosamente',
    type: GeneralConfig 
  })
  @Post()
  async create(@Body() createGeneralConfigDto: CreateGeneralConfigDto): Promise<GeneralConfig> {
    return this.generalConfigsService.create(createGeneralConfigDto);
  }

  @ApiOperation({ summary: 'Obtener todas las configuraciones generales' })
  @ApiOkResponse({ 
    description: 'Lista de todas las configuraciones generales',
    type: [GeneralConfig] 
  })
  @Get()
  async findAll(): Promise<GeneralConfig[]> {
    return this.generalConfigsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener la primera configuración general' })
  @ApiOkResponse({ 
    description: 'Primera configuración general',
    type: GeneralConfig 
  })
  @Get('first')
  async findFirst(): Promise<GeneralConfig> {
    return this.generalConfigsService.findFirst();
  }

  @ApiOperation({ summary: 'Obtener configuraciones generales paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'nombreEntidad', required: false, type: String, description: 'Filtrar por nombre de entidad' })
  @ApiQuery({ name: 'propietario', required: false, type: String, description: 'Filtrar por propietario' })
  @ApiQuery({ name: 'numeroId', required: false, type: String, description: 'Filtrar por número de identificación' })
  @ApiQuery({ name: 'direccion', required: false, type: String, description: 'Filtrar por dirección' })
  @ApiQuery({ name: 'telefono', required: false, type: String, description: 'Filtrar por teléfono' })
  @ApiQuery({ name: 'correo', required: false, type: String, description: 'Filtrar por correo electrónico' })
  @ApiQuery({ name: 'numeroInicioFacturas', required: false, type: Number, description: 'Filtrar por número de inicio de facturas' })
  @ApiOkResponse({ 
    description: 'Lista paginada de configuraciones generales',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/GeneralConfig' }
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
    @Query('nombreEntidad') nombreEntidad?: string,
    @Query('propietario') propietario?: string,
    @Query('numeroId') numeroId?: string,
    @Query('direccion') direccion?: string,
    @Query('telefono') telefono?: string,
    @Query('correo') correo?: string,
    @Query('numeroInicioFacturas') numeroInicioFacturas?: string,
  ): Promise<{ data: GeneralConfig[]; total: number; page: number; limit: number }> {
    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterGeneralConfigDto = { 
      nombreEntidad, 
      propietario, 
      numeroId,
      direccion,
      telefono,
      correo,
      numeroInicioFacturas: numeroInicioFacturas ? Number(numeroInicioFacturas) : undefined
    };
    
    return this.generalConfigsService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una configuración general por ID' })
  @ApiParam({ name: 'id', description: 'ID de la configuración general' })
  @ApiOkResponse({ 
    description: 'Configuración general encontrada',
    type: GeneralConfig 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GeneralConfig> {
    return this.generalConfigsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una configuración general' })
  @ApiParam({ name: 'id', description: 'ID de la configuración general a actualizar' })
  @ApiOkResponse({ 
    description: 'Configuración general actualizada exitosamente',
    type: GeneralConfig 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGeneralConfigDto: UpdateGeneralConfigDto): Promise<GeneralConfig> {
    return this.generalConfigsService.update(id, updateGeneralConfigDto);
  }

  @ApiOperation({ summary: 'Eliminar una configuración general' })
  @ApiParam({ name: 'id', description: 'ID de la configuración general a eliminar' })
  @ApiOkResponse({ description: 'Configuración general eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.generalConfigsService.remove(id);
  }
} 