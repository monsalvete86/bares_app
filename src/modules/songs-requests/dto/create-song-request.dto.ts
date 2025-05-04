import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSongRequestDto {
  @ApiProperty({ description: 'Nombre de la canción solicitada', example: 'Bohemian Rhapsody' })
  @IsString()
  @IsNotEmpty()
  songName: string;

  @ApiProperty({ description: 'ID de la mesa que solicita la canción', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  tableId: string;

  @ApiPropertyOptional({ description: 'ID del cliente que solicita la canción', example: '123e4567-e89b-12d3-a456-426614174001', required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ 
    description: 'Indica si la canción es de karaoke', 
    example: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isKaraoke?: boolean;

  @ApiPropertyOptional({ 
    description: 'Indica si la canción ya fue reproducida', 
    example: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isPlayed?: boolean;

  @ApiPropertyOptional({ 
    description: 'Indica si la solicitud está activa', 
    example: true, 
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 