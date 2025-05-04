import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'ID único de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID de la mesa asociada a la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column()
  tableId: string;
  
  @ApiProperty({
    description: 'Mesa asociada a la orden',
    type: () => Table
  })
  @ManyToOne(() => Table, table => table.orders, { lazy: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ApiProperty({
    description: 'ID del cliente asociado a la orden (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  @Column({ nullable: true })
  clientId: string;
  
  @ApiProperty({
    description: 'Cliente asociado a la orden',
    type: () => Customer,
    nullable: true
  })
  @ManyToOne(() => Customer, { lazy: true })
  @JoinColumn({ name: 'clientId' })
  client: Customer;

  @ApiProperty({
    description: 'Items incluidos en la orden',
    type: [OrderItem]
  })
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({
    description: 'Total de la orden',
    example: 99.99
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({
    description: 'Estado de la orden',
    example: 'pending',
    enum: ['pending', 'completed', 'cancelled', 'processing']
  })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({
    description: 'Fecha de creación de la orden',
    example: '2023-01-01T12:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la orden',
    example: '2023-01-01T12:30:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Indica si la orden está activa',
    example: true
  })
  @Column({ default: true })
  isActive: boolean;
} 