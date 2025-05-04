import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequest } from './entities/order-request.entity';
import { OrderRequestItem } from './entities/order-request-item.entity';
import { OrderRequestsService } from './services/order-requests.service';
import { OrderRequestItemsService } from './services/order-request-items.service';
import { OrderRequestsController } from './controllers/order-requests.controller';
import { OrderRequestItemsController } from './controllers/order-request-items.controller';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequest, OrderRequestItem]),
    WebsocketsModule,
  ],
  controllers: [OrderRequestsController, OrderRequestItemsController],
  providers: [OrderRequestsService, OrderRequestItemsService],
  exports: [OrderRequestsService, OrderRequestItemsService],
})
export class OrderRequestsModule {} 