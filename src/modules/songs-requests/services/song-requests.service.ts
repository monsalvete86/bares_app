import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongRequest } from '../entities/song-request.entity';
import { CreateSongRequestDto } from '../dto/create-song-request.dto';
import { UpdateSongRequestDto } from '../dto/update-song-request.dto';
import { FilterSongRequestDto } from '../dto/filter-song-request.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { WebsocketsService } from '../../websockets/services/websockets.service';

@Injectable()
export class SongRequestsService {
  constructor(
    @InjectRepository(SongRequest)
    private readonly songRequestRepository: Repository<SongRequest>,
    private readonly websocketsService: WebsocketsService
  ) {}

  async create(createSongRequestDto: CreateSongRequestDto): Promise<SongRequest> {
    try {
      // Obtener el último número de orden para la mesa y ronda actual
      const lastSongInRound = await this.songRequestRepository.findOne({
        where: { tableId: createSongRequestDto.tableId, isActive: true },
        order: { roundNumber: 'DESC' },
      });

      let roundNumber = 1;
      let orderInRound = 1;

      if (lastSongInRound) {
        roundNumber = lastSongInRound.roundNumber;
        
        // Verificar si hay más canciones en la misma ronda
        const songsInCurrentRound = await this.songRequestRepository.count({
          where: { 
            tableId: createSongRequestDto.tableId,
            roundNumber,
            isActive: true
          }
        });
        
        if (songsInCurrentRound > 0) {
          orderInRound = songsInCurrentRound + 1;
        }
      }

      const songRequest = this.songRequestRepository.create({
        ...createSongRequestDto,
        roundNumber,
        orderInRound
      });
      
      const savedSongRequest = await this.songRequestRepository.save(songRequest);
      
      // Emitir evento WebSocket con la lista actualizada de canciones de esta mesa
      const updatedSongRequests = await this.findActiveByTable(createSongRequestDto.tableId);
      this.websocketsService.notifySongRequestUpdate(createSongRequestDto.tableId, updatedSongRequests);
      
      return savedSongRequest;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La solicitud de canción ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<SongRequest[]> {
    return this.songRequestRepository.find({
      relations: ['table', 'client'],
      order: { roundNumber: 'ASC', orderInRound: 'ASC', createdAt: 'ASC' }
    });
  }

  async findPaginated(paginationDto: PaginationDto, filterDto: FilterSongRequestDto): Promise<{ 
    data: SongRequest[]; 
    total: number; 
    page: number; 
    limit: number 
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.songRequestRepository.createQueryBuilder('songRequest')
      .leftJoinAndSelect('songRequest.table', 'table')
      .leftJoinAndSelect('songRequest.client', 'client');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.songName) {
        queryBuilder.andWhere('songRequest.songName LIKE :songName', { songName: `%${filterDto.songName}%` });
      }
      if (filterDto.tableId) {
        queryBuilder.andWhere('songRequest.tableId = :tableId', { tableId: filterDto.tableId });
      }
      if (filterDto.clientId) {
        queryBuilder.andWhere('songRequest.clientId = :clientId', { clientId: filterDto.clientId });
      }
      if (filterDto.isKaraoke !== undefined) {
        queryBuilder.andWhere('songRequest.isKaraoke = :isKaraoke', { isKaraoke: filterDto.isKaraoke });
      }
      if (filterDto.isPlayed !== undefined) {
        queryBuilder.andWhere('songRequest.isPlayed = :isPlayed', { isPlayed: filterDto.isPlayed });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('songRequest.isActive = :isActive', { isActive: filterDto.isActive });
      }
    }

    queryBuilder.orderBy('songRequest.roundNumber', 'ASC')
      .addOrderBy('songRequest.orderInRound', 'ASC')
      .addOrderBy('songRequest.createdAt', 'ASC');

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

  async findOne(id: string): Promise<SongRequest> {
    const songRequest = await this.songRequestRepository.findOne({ 
      where: { id },
      relations: ['table', 'client']
    });
    
    if (!songRequest) {
      throw new NotFoundException(`Solicitud de canción con ID ${id} no encontrada`);
    }
    
    return songRequest;
  }

  async update(id: string, updateSongRequestDto: UpdateSongRequestDto): Promise<SongRequest> {
    const songRequest = await this.findOne(id);
    
    try {
      Object.assign(songRequest, updateSongRequestDto);
      const updated = await this.songRequestRepository.save(songRequest);
      
      // Si se actualiza una canción, emitir evento WebSocket
      if (updated.tableId) {
        const updatedSongRequests = await this.findActiveByTable(updated.tableId);
        this.websocketsService.notifySongRequestUpdate(updated.tableId, updatedSongRequests);
      }
      
      return updated;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La solicitud de canción ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const songRequest = await this.findOne(id);
    const tableId = songRequest.tableId;
    
    await this.songRequestRepository.remove(songRequest);
    
    // Emitir evento WebSocket después de eliminar
    const updatedSongRequests = await this.findActiveByTable(tableId);
    this.websocketsService.notifySongRequestUpdate(tableId, updatedSongRequests);
  }
  
  async markAsPlayed(id: string): Promise<SongRequest> {
    const songRequest = await this.findOne(id);
    songRequest.isPlayed = true;
    const updated = await this.songRequestRepository.save(songRequest);
    
    // Emitir evento WebSocket
    const updatedSongRequests = await this.findActiveByTable(updated.tableId);
    this.websocketsService.notifySongRequestUpdate(updated.tableId, updatedSongRequests);
    
    return updated;
  }

  async deactivateAllByTable(tableId: string): Promise<void> {
    await this.songRequestRepository.update(
      { tableId, isActive: true },
      { isActive: false }
    );
    
    // Emitir evento WebSocket con lista vacía (ya que todas están desactivadas)
    const updatedSongRequests = await this.findActiveByTable(tableId);
    this.websocketsService.notifySongRequestUpdate(tableId, updatedSongRequests);
  }

  async findActiveByTable(tableId: string): Promise<SongRequest[]> {
    return this.songRequestRepository.find({
      where: { tableId, isActive: true },
      relations: ['table', 'client'],
      order: { roundNumber: 'ASC', orderInRound: 'ASC', createdAt: 'ASC' }
    });
  }
} 