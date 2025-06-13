import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderRequest } from 'src/modules/order-requests/entities/order-request.entity';

export class TableDetailOrderItemDto {
  @ApiProperty({
    description: 'ID único del item de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  productId: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Hamburguesa con queso'
  })
  productName: string;

  @ApiProperty({
    description: 'Cantidad ordenada',
    example: 2
  })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario',
    example: 10.99
  })
  unitPrice: number;
  
  @ApiProperty({
    description: 'Subtotal del ítem',
    example: 21.98
  })
  subtotal: number;
}

export class TableDetailOrderDto {
  @ApiProperty({
    description: 'ID único de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Cliente asociado a la orden',
    type: Customer
  })
  client: Customer;

  @ApiProperty({
    description: 'Items de la orden con información de productos',
    type: [TableDetailOrderItemDto]
  })
  items: TableDetailOrderItemDto[];

  @ApiProperty({
    description: 'Total de la orden',
    example: 35.97
  })
  total: number;

  @ApiProperty({
    description: 'Estado de la orden',
    example: 'pending',
    enum: ['pending', 'completed', 'cancelled', 'processing']
  })
  status: string;

  @ApiProperty({
    description: 'Fecha de creación de la orden',
    example: '2023-01-01T12:00:00Z'
  })
  createdAt: Date;
}

export class TableDetailDto {
  @ApiProperty({
    description: 'ID único de la mesa',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Número de la mesa',
    example: 1
  })
  number: number;

  @ApiProperty({
    description: 'Nombre de la mesa',
    example: 'Mesa VIP'
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la mesa',
    example: 'Mesa para eventos especiales',
    nullable: true
  })
  description: string;

  @ApiProperty({
    description: 'Indica si la mesa está ocupada',
    example: true
  })
  isOccupied: boolean;

  @ApiProperty({
    description: 'Indica si la mesa está activa',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Clientes asociados a la mesa',
    type: [Customer]
  })
  customers: Customer[];

  @ApiProperty({
    description: 'Órdenes activas',
    type: [TableDetailOrderDto]
  })
  activeOrders: TableDetailOrderDto[];

  @ApiProperty({
    description: 'Solicitudes de órdenes pendientes',
    type: [OrderRequest]
  })
  pendingOrderRequests: OrderRequest[];

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
} 