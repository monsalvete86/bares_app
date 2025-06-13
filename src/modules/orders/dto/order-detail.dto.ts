import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { OrderStatus } from './create-order.dto';
import { GroupedOrderItemDto } from './grouped-order-item.dto';

export class OrderDetailDto {
  @ApiProperty({
    description: 'ID único de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID de la mesa asociada',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  tableId: string;

  @ApiProperty({
    description: 'Información completa de la mesa',
    type: () => Table
  })
  table: Table;

  @ApiProperty({
    description: 'ID del cliente (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  clientId: string;

  @ApiProperty({
    description: 'Información completa del cliente',
    type: () => Customer,
    nullable: true
  })
  client: Customer;

  @ApiProperty({
    description: 'Items agrupados por producto',
    type: [GroupedOrderItemDto]
  })
  groupedItems: GroupedOrderItemDto[];

  @ApiProperty({
    description: 'Total de la orden',
    example: 99.99
  })
  total: number;

  @ApiProperty({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PENDING
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-01-01T12:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-01-01T12:30:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Indica si la orden está activa',
    example: true
  })
  isActive: boolean;
} 