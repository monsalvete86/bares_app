import { Customer } from 'src/modules/customers/entities/customer.entity';
import { OrderRequest } from 'src/modules/order-requests/entities/order-request.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { SongRequest } from 'src/modules/songs-requests/entities/song-request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tables')
export class Table {
  @ApiProperty({ description: 'ID único de la mesa', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Número de la mesa', example: 1 })
  @Column()
  number: number;

  @ApiProperty({ description: 'Nombre de la mesa', example: 'Mesa VIP' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Descripción de la mesa', example: 'Mesa para eventos especiales', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Indica si la mesa está ocupada', example: false, default: false })
  @Column({ default: false })
  isOccupied: boolean;

  @ApiProperty({ description: 'Órdenes asociadas a esta mesa', type: () => [Order], required: false })
  @OneToMany(() => Order, order => order.table, { lazy: true })
  orders: Order[];

  @ApiProperty({ description: 'Solicitudes de órdenes asociadas a esta mesa', type: () => [OrderRequest], required: false })
  @OneToMany(() => OrderRequest, orderRequest => orderRequest.table, { lazy: true })
  orderRequests: OrderRequest[];

  @ApiProperty({ description: 'Clientes asociados a esta mesa', type: () => [Customer], required: false })
  @OneToMany(() => Customer, customer => customer.table, { lazy: true })
  customers: Customer[];

  @ApiProperty({ description: 'Solicitudes de canciones asociadas a esta mesa', type: () => [SongRequest], required: false })
  @OneToMany(() => SongRequest, songRequest => songRequest.table, { lazy: true })
  songRequests: SongRequest[];

  @ApiProperty({ description: 'Fecha de creación', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Indica si la mesa está activa', example: true, default: true })
  @Column({ default: true })
  isActive: boolean;
} 