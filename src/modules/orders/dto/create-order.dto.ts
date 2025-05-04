import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

// Enum para los estados de la orden
export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing',
}

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'ID de la mesa asociada a la orden', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsNotEmpty()
  @IsUUID()
  tableId: string;

  @ApiPropertyOptional({ 
    description: 'ID del cliente asociado a la orden (opcional)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiProperty({ 
    description: 'Lista de productos a incluir en la orden',
    type: [CreateOrderItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ 
    description: 'Estado de la orden', 
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.PENDING,
    default: OrderStatus.PENDING
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.PENDING;

  @ApiPropertyOptional({ 
    description: 'Indica si la orden está activa', 
    example: true,
    default: true 
  })
  @IsOptional()
  isActive?: boolean = true;
} 