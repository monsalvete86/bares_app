import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para eventos de WebSocket relacionados con solicitudes de canciones
 */
export class SongRequestUpdateDto {
  @ApiProperty({
    description: 'ID de la mesa para la cual se actualizaron las canciones',
    example: '12345',
  })
  tableId: string;

  @ApiProperty({
    description: 'Lista actualizada de solicitudes de canciones',
    type: 'array',
    isArray: true,
  })
  songRequests: any[];
}

/**
 * DTO para eventos de WebSocket relacionados con actualizaciones de estado de mesa
 */
export class TableStatusUpdateDto {
  @ApiProperty({
    description: 'ID de la mesa actualizada',
    example: '12345',
  })
  tableId: string;

  @ApiProperty({
    description: 'Estado actualizado de la mesa',
    example: { isOccupied: true, occupiedAt: '2023-01-01T12:00:00Z' },
  })
  tableStatus: any;
}

/**
 * DTO para eventos de WebSocket relacionados con solicitudes de órdenes
 */
export class OrderRequestUpdateDto {
  @ApiProperty({
    description: 'ID de la mesa para la cual se actualizaron las órdenes',
    example: '12345',
  })
  tableId: string;

  @ApiProperty({
    description: 'Lista actualizada de solicitudes de órdenes',
    type: 'array',
    isArray: true,
  })
  orderRequests: any[];
}

/**
 * DTO para eventos de WebSocket relacionados con notificaciones de nuevos pedidos
 */
export class NewOrderNotificationDto {
  @ApiProperty({
    description: 'ID de la solicitud de orden creada',
    example: '12345',
  })
  orderRequestId: string;

  @ApiProperty({
    description: 'ID de la mesa que realizó el pedido',
    example: '12345',
  })
  tableId: string;

  @ApiProperty({
    description: 'ID del cliente que realizó el pedido (opcional)',
    example: '12345',
    required: false,
  })
  clientId?: string;

  @ApiProperty({
    description: 'Información del pedido',
    example: {
      total: 99.99,
      itemsCount: 3,
      createdAt: '2023-01-01T12:00:00Z',
    },
  })
  orderInfo: {
    total: number;
    itemsCount: number;
    createdAt: Date;
  };
} 