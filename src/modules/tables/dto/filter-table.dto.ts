import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class FilterTableDto {
  @ApiPropertyOptional({ description: 'Filtrar por número de mesa', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  number?: number;

  @ApiPropertyOptional({ description: 'Filtrar por nombre de mesa', example: 'VIP' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por descripción de mesa', example: 'evento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado de ocupación', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isOccupied?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por estado (activa/inactiva)', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
} 