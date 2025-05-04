import { Module } from '@nestjs/common';
import { AppGateway } from './gateways/app.gateway';
import { WebsocketsService } from './services/websockets.service';

@Module({
  imports: [],
  providers: [AppGateway, WebsocketsService],
  exports: [AppGateway, WebsocketsService],
})
export class WebsocketsModule {} 