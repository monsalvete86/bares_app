import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderRequest } from 'src/modules/order-requests/entities/order-request.entity';
import { SongRequest } from 'src/modules/songs-requests/entities/song-request.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('customers')
export class Customer extends BaseEntity {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @Column()
  name: string;

  @ApiProperty({ description: 'ID de la mesa asociada al cliente', example: 'uuid-de-la-mesa' })
  @Column()
  tableId: string;

  @ApiProperty({ description: 'Mesa asociada al cliente', type: () => Table })
  @ManyToOne(() => Table, table => table.customers, { lazy: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ApiProperty({ description: 'Órdenes del cliente', type: [Order] })
  @OneToMany(() => Order, order => order.client, { lazy: true })
  orders: Order[];

  @ApiProperty({ description: 'Solicitudes de órdenes del cliente', type: [OrderRequest] })
  @OneToMany(() => OrderRequest, orderRequest => orderRequest.client, { lazy: true })
  orderRequests: OrderRequest[];

  @ApiProperty({ description: 'Solicitudes de canciones del cliente', type: [SongRequest] })
  @OneToMany(() => SongRequest, songRequest => songRequest.client, { lazy: true })
  songRequests: SongRequest[];

  @ApiProperty({ description: 'Indica si el cliente está activo', example: true, default: true })
  @Column({ default: true })
  isActive: boolean;
} 