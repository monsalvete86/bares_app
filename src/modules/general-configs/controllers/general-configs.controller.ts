import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { GeneralConfigsService } from '../services/general-configs.service';
import { CreateGeneralConfigDto } from '../dto/create-general-config.dto';
import { UpdateGeneralConfigDto } from '../dto/update-general-config.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GeneralConfig } from '../entities/general-config.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Configuración General')
@ApiBearerAuth('JWT-auth')
@Controller('general-configs')
@UseGuards(JwtAuthGuard)
export class GeneralConfigsController {
  constructor(private readonly generalConfigsService: GeneralConfigsService) {}

  @ApiOperation({ summary: 'Crear la configuración general del bar (solo si no existe)' })
  @ApiCreatedResponse({
    description: 'Configuración general creada exitosamente',
    type: GeneralConfig,
  })
  @Post()
  async create(
    @Body() createGeneralConfigDto: CreateGeneralConfigDto,
  ): Promise<GeneralConfig> {
    return this.generalConfigsService.create(createGeneralConfigDto);
  }

  @ApiOperation({ summary: 'Obtener la configuración general del bar' })
  @ApiOkResponse({
    description: 'Configuración general del bar',
    type: GeneralConfig,
  })
  @Get()
  async get(): Promise<GeneralConfig> {
    try {
      return await this.generalConfigsService.findFirst();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No se ha configurado la información del bar todavía');
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Actualizar la configuración general del bar' })
  @ApiOkResponse({
    description: 'Configuración general actualizada exitosamente',
    type: GeneralConfig,
  })
  @Patch()
  async update(
    @Body() updateGeneralConfigDto: UpdateGeneralConfigDto,
  ): Promise<GeneralConfig> {
    try {
      const config = await this.generalConfigsService.findFirst();
      return this.generalConfigsService.update(config.id, updateGeneralConfigDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No se ha configurado la información del bar todavía. Cree una configuración antes de actualizarla.');
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Eliminar la configuración general del bar' })
  @ApiOkResponse({
    description: 'Configuración general eliminada exitosamente',
  })
  @Delete()
  async remove(): Promise<void> {
    try {
      const config = await this.generalConfigsService.findFirst();
      return this.generalConfigsService.remove(config.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No hay configuración para eliminar');
      }
      throw error;
    }
  }
}
