import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderRequestItemDto } from './create-order-request-item.dto';

export class CreateOrderRequestDto {
  @ApiProperty({ 
    description: 'ID de la mesa que solicita la orden', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsNotEmpty()
  @IsUUID()
  tableId: string;

  @ApiPropertyOptional({ 
    description: 'ID del cliente que solicita la orden (opcional)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ 
    description: 'Lista de productos solicitados',
    type: [CreateOrderRequestItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderRequestItemDto)
  items: CreateOrderRequestItemDto[];
} 