import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({
    description: 'ID único del ítem de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID de la orden a la que pertenece este ítem',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column()
  orderId: string;

  @ApiProperty({
    description: 'Orden a la que pertenece este ítem',
    type: () => Order
  })
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({
    description: 'ID del producto asociado',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column()
  productId: string;

  @ApiProperty({
    description: 'Producto asociado',
    type: () => Product
  })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2
  })
  @Column('int')
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 12.99
  })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({
    description: 'Subtotal del ítem (precio × cantidad)',
    example: 25.98
  })
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-01-01T12:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-01-01T12:30:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;
} 