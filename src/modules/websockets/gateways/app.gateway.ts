import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SongRequestUpdateDto, TableStatusUpdateDto, OrderRequestUpdateDto, NewOrderNotificationDto } from '../dto/socket-event.dto';

/**
 * Gateway principal para manejar las conexiones WebSocket y emitir eventos a los clientes.
 * Este gateway se encarga de:
 * - Manejar conexiones y desconexiones de clientes
 * - Emitir eventos para actualizar listas de canciones solicitadas
 * - Emitir eventos para actualizar estados de mesas
 * - Emitir eventos para actualizar solicitudes de órdenes
 * - Emitir notificaciones de nuevos pedidos
 */
@WebSocketGateway({
  cors: {
    origin: true, // Permitimos cualquier origen en desarrollo
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Disposition', 'Content-Length', 'X-Total-Count'],
    preflightContinue: false,
    maxAge: 3600, // Cache de preflight por 1 hora
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer() server: Server;

  /**
   * Método que se ejecuta cuando el gateway se inicializa
   */
  afterInit(): void {
    this.logger.log('WebSocket Gateway inicializado');
  }

  /**
   * Método que se ejecuta cuando un cliente se conecta al WebSocket
   * @param client - Cliente que se conectó
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado: ${client.id}`);
    const connectedClients = this.server.sockets.sockets.size;
    this.logger.log(`Clientes conectados actualmente: ${connectedClients}`);
  }

  /**
   * Método que se ejecuta cuando un cliente se desconecta del WebSocket
   * @param client - Cliente que se desconectó
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    const connectedClients = this.server.sockets.sockets.size;
    this.logger.log(`Clientes conectados actualmente: ${connectedClients}`);
  }

  /**
   * Método para emitir actualización de lista de canciones solicitadas
   * @param tableId - ID de la mesa para la cual se actualizaron las canciones
   * @param songRequests - Lista actualizada de solicitudes de canciones para la mesa
   */
  emitSongRequestUpdate(tableId: string, songRequests: any[]): void {
    this.logger.log(`Emitiendo actualización de canciones para mesa: ${tableId}`);
    const data: SongRequestUpdateDto = { tableId, songRequests };
    this.server.emit('songRequestUpdate', data);
  }

  /**
   * Método para emitir actualización del estado de una mesa
   * @param tableId - ID de la mesa actualizada
   * @param tableStatus - Estado actualizado de la mesa
   */
  emitTableStatusUpdate(tableId: string, tableStatus: any): void {
    this.logger.log(`Emitiendo actualización de estado de mesa: ${tableId}`);
    const data: TableStatusUpdateDto = { tableId, tableStatus };
    this.server.emit('tableStatusUpdate', data);
  }

  /**
   * Método para emitir actualización de solicitudes de órdenes
   * @param tableId - ID de la mesa para la cual se actualizaron las órdenes
   * @param orderRequests - Lista actualizada de solicitudes de órdenes para la mesa
   */
  emitOrderRequestUpdate(tableId: string, orderRequests: any[]): void {
    this.logger.log(`Emitiendo actualización de solicitudes de órdenes para mesa: ${tableId}`);
    const data: OrderRequestUpdateDto = { tableId, orderRequests };
    this.server.emit('orderRequestUpdate', data);
  }

  /**
   * Método para emitir notificación de nuevo pedido
   * @param orderRequestId - ID de la solicitud de orden creada
   * @param tableId - ID de la mesa que realizó el pedido
   * @param clientId - ID del cliente que realizó el pedido (opcional)
   * @param orderInfo - Información del pedido (total, cantidad de items, fecha de creación)
   */
  emitNewOrderNotification(
    orderRequestId: string, 
    tableId: string, 
    clientId: string | undefined, 
    orderInfo: { total: number; itemsCount: number; createdAt: Date }
  ): void {
    this.logger.log(`Emitiendo notificación de nuevo pedido para mesa: ${tableId}`);
    const data: NewOrderNotificationDto = { 
      orderRequestId, 
      tableId, 
      clientId, 
      orderInfo 
    };
    this.server.emit('newOrderNotification', data);
  }
} 