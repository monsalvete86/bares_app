import { IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterOrderItemDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID del producto', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por cantidad mínima', 
    example: 2 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minQuantity?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por cantidad máxima', 
    example: 10 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxQuantity?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por precio unitario mínimo', 
    example: 5.99 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minUnitPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por precio unitario máximo', 
    example: 19.99 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxUnitPrice?: number;
} 