import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderRequestItem } from 'src/modules/order-requests/entities/order-request-item.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductType {
  FOOD = 'food',
  BEVERAGE = 'beverage',
  OTHER = 'other',
}

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty({ description: 'Nombre del producto', example: 'Hamburguesa' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Descripción del producto', example: 'Hamburguesa con queso y papas fritas', required: false, nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 10.99, type: 'number' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Cantidad en stock', example: 50, default: 0, type: 'number' })
  @Column({ default: 0 })
  stock: number;

  @ApiProperty({ 
    description: 'Tipo de producto', 
    enum: ProductType,
    enumName: 'ProductType',
    example: ProductType.FOOD,
    default: ProductType.OTHER
  })
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.OTHER,
  })
  type: ProductType;

  @ApiProperty({ 
    description: 'Lista de items de órdenes relacionados con este producto', 
    type: () => [OrderItem],
    required: false,
    isArray: true
  })
  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @ApiProperty({ 
    description: 'Lista de items de solicitudes de órdenes relacionados con este producto', 
    type: () => [OrderRequestItem],
    required: false,
    isArray: true
  })
  @OneToMany(() => OrderRequestItem, orderRequestItem => orderRequestItem.product)
  orderRequestItems: OrderRequestItem[];

  @ApiProperty({ 
    description: 'Indica si el producto está activo', 
    example: true, 
    default: true,
    type: 'boolean'
  })
  @Column({ default: true })
  isActive: boolean;
} 