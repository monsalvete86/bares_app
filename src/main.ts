import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Iniciar la aplicación sin CORS para configurarlo manualmente
  const app = await NestFactory.create(AppModule, { 
    cors: false,
  });
  
  // Configuración CORS manualmente usando middleware Express directo
  app.use((req, res, next) => {
    // Siempre permitir todos los orígenes
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    
    // Permitir credenciales
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Permitir todos los métodos HTTP
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    
    // Permitir todas las cabeceras
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
    
    // Cabeceras expuestas
    res.header('Access-Control-Expose-Headers', 'Content-Disposition,Content-Length,X-Total-Count');
    
    // Cache de preflight
    res.header('Access-Control-Max-Age', '3600');
    
    // Manejar solicitudes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    return next();
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Configuración de Swagger
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sasseri Bares API')
      .setDescription('API para la gestión de bares y restaurantes')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese el token JWT',
          in: 'header',
        },
        'JWT-auth', // Este es el nombre del esquema de seguridad
      )
      .build();
    
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      include: [
        // Incluimos los módulos que queremos mostrar en Swagger
        require('./modules/users/users.module').UsersModule,
        require('./modules/tables/tables.module').TablesModule,
        require('./modules/products/products.module').ProductsModule,
        require('./modules/orders/orders.module').OrdersModule,
        require('./modules/customers/customers.module').CustomersModule,
        require('./modules/order-requests/order-requests.module').OrderRequestsModule,
        require('./modules/songs-requests/song-requests.module').SongRequestsModule,
        require('./modules/general-configs/general-configs.module').GeneralConfigsModule,
      ],
    });
    
    SwaggerModule.setup('api/docs', app, document);
  }
  
  const port = configService.get<number>('app.port') || 3000;
  const host = configService.get<string>('app.host') || 'localhost';
  
  await app.listen(port, host);
  console.log(`Aplicación ejecutándose en: ${await app.getUrl()}`);
  console.log(`Documentación Swagger disponible en: ${await app.getUrl()}/api/docs`);
  console.log('CORS configurado para permitir todas las solicitudes desde cualquier origen');
}

bootstrap();
