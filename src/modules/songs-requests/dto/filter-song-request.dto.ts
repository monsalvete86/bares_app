import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterSongRequestDto {
  @ApiPropertyOptional({ description: 'Filtrar por nombre de canción', example: 'Bohemian' })
  @IsOptional()
  @IsString()
  songName?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de mesa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de cliente', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado de karaoke', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isKaraoke?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por estado de reproducción', example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPlayed?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
} 