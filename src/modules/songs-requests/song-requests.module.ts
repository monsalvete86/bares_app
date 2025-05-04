import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRequest } from './entities/song-request.entity';
import { SongRequestsService } from './services/song-requests.service';
import { SongRequestsController } from './controllers/song-requests.controller';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongRequest]),
    WebsocketsModule
  ],
  controllers: [SongRequestsController],
  providers: [SongRequestsService],
  exports: [SongRequestsService],
})
export class SongRequestsModule {} 