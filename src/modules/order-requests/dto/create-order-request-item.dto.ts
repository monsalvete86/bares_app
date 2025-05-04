import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderRequestItemDto {
  @ApiProperty({ 
    description: 'ID del producto solicitado', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ 
    description: 'Cantidad de unidades solicitadas', 
    example: 2,
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ 
    description: 'Precio unitario del producto solicitado', 
    example: 10.99,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice: number;
} 