import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { OrderRequestItem } from './order-request-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_requests')
export class OrderRequest {
  @ApiProperty({
    description: 'ID único de la solicitud de orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID de la mesa asociada a la solicitud',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column()
  tableId: string;
  
  @ApiProperty({
    description: 'Mesa asociada a la solicitud',
    type: () => Table
  })
  @ManyToOne(() => Table, table => table.orderRequests, { lazy: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ApiProperty({
    description: 'ID del cliente asociado a la solicitud (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  @Column({ nullable: true })
  clientId: string;
  
  @ApiProperty({
    description: 'Cliente asociado a la solicitud',
    type: () => Customer,
    nullable: true
  })
  @ManyToOne(() => Customer, { lazy: true })
  @JoinColumn({ name: 'clientId' })
  client: Customer;

  @ApiProperty({
    description: 'Items incluidos en la solicitud',
    type: [OrderRequestItem]
  })
  @OneToMany(() => OrderRequestItem, orderRequestItem => orderRequestItem.orderRequest, { cascade: true })
  items: OrderRequestItem[];

  @ApiProperty({
    description: 'Total de la solicitud',
    example: 99.99
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({
    description: 'Fecha de creación de la solicitud',
    example: '2023-01-01T12:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la solicitud',
    example: '2023-01-01T12:30:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Indica si la solicitud está completada',
    example: false
  })
  @Column({ default: false })
  isCompleted: boolean;
} 