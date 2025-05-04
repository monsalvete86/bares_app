import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralConfig } from './entities/general-config.entity';
import { GeneralConfigsService } from './services/general-configs.service';
import { GeneralConfigsController } from './controllers/general-configs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralConfig])],
  controllers: [GeneralConfigsController],
  providers: [GeneralConfigsService],
  exports: [GeneralConfigsService],
})
export class GeneralConfigsModule {} 