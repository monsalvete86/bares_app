import { IsEnum, IsOptional, IsNumber, IsString, IsBoolean, Min, Max } from 'class-validator';
import { ProductType } from '../entities/product.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class FilterProductDto {
  @ApiPropertyOptional({ description: 'Filtrar por nombre del producto', example: 'Hamburguesa' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por descripción', example: 'queso' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Filtrar por precio mínimo', example: 5, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Filtrar por precio máximo', example: 15, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filtrar por stock mínimo', example: 10, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStock?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de producto', 
    enum: ProductType,
    enumName: 'ProductType', 
    example: ProductType.FOOD
  })
  @IsOptional()
  @IsEnum(ProductType)
  @Transform(({ value }) => {
    if (value && Object.values(ProductType).includes(value)) {
      return value;
    }
    return undefined;
  })
  type?: ProductType;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado (activo/inactivo)', 
    example: true,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
} 