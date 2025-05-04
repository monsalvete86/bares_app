import { IsEnum, IsOptional, IsUUID, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { OrderStatus } from './create-order.dto';

export class FilterOrderDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID de la mesa',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por ID del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado de la orden',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.PENDING
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  @Transform(({ value }) => {
    if (value && Object.values(OrderStatus).includes(value)) {
      return value;
    }
    return undefined;
  })
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha de creación (desde)',
    example: '2023-01-01' 
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha de creación (hasta)',
    example: '2023-12-31' 
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado activo/inactivo',
    example: true 
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