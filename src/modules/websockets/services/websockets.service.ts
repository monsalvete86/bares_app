import { Injectable, Logger } from '@nestjs/common';
import { AppGateway } from '../gateways/app.gateway';

/**
 * Servicio para centralizar la lógica de WebSockets y proporcionar
 * métodos de utilidad para los demás módulos que necesiten usar WebSockets
 */
@Injectable()
export class WebsocketsService {
  private readonly logger = new Logger(WebsocketsService.name);

  constructor(private readonly appGateway: AppGateway) {}

  /**
   * Notifica a todos los clientes conectados sobre una actualización en las solicitudes de canciones
   * @param tableId - ID de la mesa que tiene actualizaciones
   * @param songRequests - Lista actualizada de solicitudes de canciones
   */
  notifySongRequestUpdate(tableId: string, songRequests: any[]): void {
    this.logger.log(`Notificando actualización de canciones para mesa: ${tableId}`);
    this.appGateway.emitSongRequestUpdate(tableId, songRequests);
  }

  /**
   * Notifica a todos los clientes conectados sobre una actualización en el estado de una mesa
   * @param tableId - ID de la mesa actualizada
   * @param tableStatus - Estado actualizado de la mesa
   */
  notifyTableStatusUpdate(tableId: string, tableStatus: any): void {
    this.logger.log(`Notificando actualización de estado de mesa: ${tableId}`);
    this.appGateway.emitTableStatusUpdate(tableId, tableStatus);
  }

  /**
   * Notifica a todos los clientes conectados sobre una actualización en las solicitudes de órdenes
   * @param tableId - ID de la mesa que tiene actualizaciones
   * @param orderRequests - Lista actualizada de solicitudes de órdenes
   */
  notifyOrderRequestUpdate(tableId: string, orderRequests: any[]): void {
    this.logger.log(`Notificando actualización de solicitudes de órdenes para mesa: ${tableId}`);
    this.appGateway.emitOrderRequestUpdate(tableId, orderRequests);
  }

  /**
   * Notifica a todos los clientes conectados sobre un nuevo pedido
   * @param orderRequestId - ID de la solicitud de orden creada
   * @param tableId - ID de la mesa que realizó el pedido
   * @param clientId - ID del cliente que realizó el pedido (opcional)
   * @param orderInfo - Información del pedido (total, cantidad de items, fecha de creación)
   */
  notifyNewOrder(
    orderRequestId: string, 
    tableId: string, 
    clientId: string | undefined, 
    orderInfo: { total: number; itemsCount: number; createdAt: Date }
  ): void {
    this.logger.log(`Notificando nuevo pedido para mesa: ${tableId}`);
    this.appGateway.emitNewOrderNotification(orderRequestId, tableId, clientId, orderInfo);
  }
} 