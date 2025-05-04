import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SongRequestsService } from '../services/song-requests.service';
import { CreateSongRequestDto } from '../dto/create-song-request.dto';
import { UpdateSongRequestDto } from '../dto/update-song-request.dto';
import { FilterSongRequestDto } from '../dto/filter-song-request.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SongRequest } from '../entities/song-request.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Solicitudes de Canciones')
@ApiBearerAuth('JWT-auth')
@Controller('song-requests')
@UseGuards(JwtAuthGuard)
export class SongRequestsController {
  constructor(private readonly songRequestsService: SongRequestsService) {}

  @ApiOperation({ summary: 'Crear nueva solicitud de canción' })
  @ApiCreatedResponse({ 
    description: 'Solicitud de canción creada exitosamente',
    type: SongRequest 
  })
  @Post()
  async create(@Body() createSongRequestDto: CreateSongRequestDto): Promise<SongRequest> {
    return this.songRequestsService.create(createSongRequestDto);
  }

  @ApiOperation({ summary: 'Obtener todas las solicitudes de canciones' })
  @ApiOkResponse({ 
    description: 'Lista de todas las solicitudes de canciones',
    type: [SongRequest] 
  })
  @Get()
  async findAll(): Promise<SongRequest[]> {
    return this.songRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener solicitudes de canciones paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'songName', required: false, type: String, description: 'Filtrar por nombre de canción' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'Filtrar por ID de mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ 
    name: 'isKaraoke', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado de karaoke',
    schema: {
      type: 'boolean'
    }
  })
  @ApiQuery({ 
    name: 'isPlayed', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado de reproducción',
    schema: {
      type: 'boolean'
    }
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado activo',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de solicitudes de canciones',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/SongRequest' }
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
    @Query('songName') songName?: string,
    @Query('tableId') tableId?: string,
    @Query('clientId') clientId?: string,
    @Query('isKaraoke') isKaraoke?: string,
    @Query('isPlayed') isPlayed?: string,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: SongRequest[]; total: number; page: number; limit: number }> {
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterSongRequestDto = { 
      songName, 
      tableId, 
      clientId,
      isKaraoke: isKaraoke === 'true' ? true : isKaraoke === 'false' ? false : undefined,
      isPlayed: isPlayed === 'true' ? true : isPlayed === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    };
    
    return this.songRequestsService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una solicitud de canción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de canción' })
  @ApiOkResponse({ 
    description: 'Solicitud de canción encontrada',
    type: SongRequest 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SongRequest> {
    return this.songRequestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener solicitudes de canciones activas por mesa' })
  @ApiParam({ name: 'tableId', description: 'ID de la mesa' })
  @ApiOkResponse({ 
    description: 'Lista de solicitudes de canciones activas para una mesa',
    type: [SongRequest] 
  })
  @Get('table/:tableId')
  async findActiveByTable(@Param('tableId') tableId: string): Promise<SongRequest[]> {
    return this.songRequestsService.findActiveByTable(tableId);
  }

  @ApiOperation({ summary: 'Actualizar una solicitud de canción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de canción a actualizar' })
  @ApiOkResponse({ 
    description: 'Solicitud de canción actualizada exitosamente',
    type: SongRequest 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSongRequestDto: UpdateSongRequestDto): Promise<SongRequest> {
    return this.songRequestsService.update(id, updateSongRequestDto);
  }

  @ApiOperation({ summary: 'Marcar una canción como reproducida' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de canción a marcar como reproducida' })
  @ApiOkResponse({ 
    description: 'Solicitud de canción marcada como reproducida exitosamente',
    type: SongRequest 
  })
  @Patch(':id/mark-played')
  async markAsPlayed(@Param('id') id: string): Promise<SongRequest> {
    return this.songRequestsService.markAsPlayed(id);
  }

  @ApiOperation({ summary: 'Desactivar todas las solicitudes de canciones de una mesa' })
  @ApiParam({ name: 'tableId', description: 'ID de la mesa' })
  @ApiOkResponse({ description: 'Solicitudes de canciones desactivadas exitosamente' })
  @Delete('table/:tableId')
  async deactivateAllByTable(@Param('tableId') tableId: string): Promise<void> {
    return this.songRequestsService.deactivateAllByTable(tableId);
  }

  @ApiOperation({ summary: 'Eliminar una solicitud de canción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de canción a eliminar' })
  @ApiOkResponse({ description: 'Solicitud de canción eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.songRequestsService.remove(id);
  }
} 