import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductType } from '../entities/product.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Hamburguesa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción del producto', example: 'Hamburguesa con queso y papas fritas' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Precio del producto', example: 10.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ description: 'Cantidad en stock', example: 50, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ 
    description: 'Tipo de producto', 
    enum: ProductType, 
    enumName: 'ProductType',
    example: ProductType.FOOD,
    default: ProductType.OTHER
  })
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @ApiPropertyOptional({ 
    description: 'Indica si el producto está activo', 
    example: true, 
    default: true 
  })
  @IsOptional()
  isActive?: boolean;
} 