import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TablesModule } from './modules/tables/tables.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderRequestsModule } from './modules/order-requests/order-requests.module';
import { GeneralConfigsModule } from './modules/general-configs/general-configs.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { SongRequestsModule } from './modules/songs-requests/song-requests.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    TablesModule,
    ProductsModule,
    OrdersModule,
    OrderRequestsModule,
    GeneralConfigsModule,
    WebsocketsModule,
    SongRequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
