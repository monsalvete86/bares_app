import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('song_requests')
export class SongRequest {
  @ApiProperty({ description: 'ID único de la solicitud de canción', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre de la canción solicitada', example: 'Bohemian Rhapsody' })
  @Column()
  songName: string;

  @ApiProperty({ description: 'ID de la mesa que solicita la canción', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  tableId: string;

  @ApiProperty({ description: 'Mesa que solicita la canción', type: () => Table })
  @ManyToOne(() => Table, (table) => table.songRequests, { lazy: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ApiProperty({ description: 'ID del cliente que solicita la canción', example: '123e4567-e89b-12d3-a456-426614174001', nullable: true })
  @Column({ nullable: true })
  clientId: string;

  @ApiProperty({ description: 'Cliente que solicita la canción', type: () => Customer, nullable: true })
  @ManyToOne(() => Customer, { lazy: true })
  @JoinColumn({ name: 'clientId' })
  client: Customer;

  @ApiProperty({ description: 'Indica si la canción es de karaoke', example: false, default: false })
  @Column({ default: false })
  isKaraoke: boolean;

  @ApiProperty({ description: 'Indica si la canción ya fue reproducida', example: false, default: false })
  @Column({ default: false })
  isPlayed: boolean;

  @ApiProperty({ description: 'Orden de la canción en la ronda actual', example: 1 })
  @Column('int')
  orderInRound: number;

  @ApiProperty({ description: 'Número de la ronda a la que pertenece la canción', example: 1 })
  @Column('int')
  roundNumber: number;

  @ApiProperty({ description: 'Fecha de creación de la solicitud', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización de la solicitud', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Indica si la solicitud está activa', example: true, default: true })
  @Column({ default: true })
  isActive: boolean;
} 