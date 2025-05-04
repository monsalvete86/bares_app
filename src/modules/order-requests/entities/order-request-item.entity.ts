import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { OrderRequest } from './order-request.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_request_items')
export class OrderRequestItem {
  @ApiProperty({
    description: 'ID único del ítem de la solicitud',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID de la solicitud a la que pertenece este ítem',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column()
  orderRequestId: string;

  @ApiProperty({
    description: 'Solicitud a la que pertenece este ítem',
    type: () => OrderRequest
  })
  @ManyToOne(() => OrderRequest, orderRequest => orderRequest.items, { lazy: true })
  @JoinColumn({ name: 'orderRequestId' })
  orderRequest: OrderRequest;

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
  @ManyToOne(() => Product, { lazy: true })
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