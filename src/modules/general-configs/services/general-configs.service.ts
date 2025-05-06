import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralConfig } from '../entities/general-config.entity';
import { CreateGeneralConfigDto } from '../dto/create-general-config.dto';
import { UpdateGeneralConfigDto } from '../dto/update-general-config.dto';

@Injectable()
export class GeneralConfigsService {
  constructor(
    @InjectRepository(GeneralConfig)
    private readonly generalConfigRepository: Repository<GeneralConfig>,
  ) {}

  async create(createGeneralConfigDto: CreateGeneralConfigDto): Promise<GeneralConfig> {
    try {
      // Verificar si ya existe una configuración
      const count = await this.generalConfigRepository.count();
      if (count > 0) {
        throw new ConflictException('Ya existe una configuración general. Utilice el método de actualización en su lugar.');
      }

      const generalConfig = this.generalConfigRepository.create(createGeneralConfigDto);
      return await this.generalConfigRepository.save(generalConfig);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Error al crear la configuración general');
    }
  }

  async findFirst(): Promise<GeneralConfig> {
    const generalConfig = await this.generalConfigRepository.findOne({
      order: { createdAt: 'ASC' },
    });
    
    if (!generalConfig) {
      throw new NotFoundException('No se encontró ninguna configuración general');
    }
    
    return generalConfig;
  }

  async findOne(id: string): Promise<GeneralConfig> {
    const generalConfig = await this.generalConfigRepository.findOne({ where: { id } });
    if (!generalConfig) {
      throw new NotFoundException(`Configuración general con ID ${id} no encontrada`);
    }
    return generalConfig;
  }

  async update(id: string, updateGeneralConfigDto: UpdateGeneralConfigDto): Promise<GeneralConfig> {
    const generalConfig = await this.findOne(id);
    
    try {
      Object.assign(generalConfig, updateGeneralConfigDto);
      return await this.generalConfigRepository.save(generalConfig);
    } catch (error) {
      throw new ConflictException('Error al actualizar la configuración general');
    }
  }

  async remove(id: string): Promise<void> {
    const generalConfig = await this.findOne(id);
    await this.generalConfigRepository.remove(generalConfig);
  }
} 