import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CorsConfigService {
  constructor(private configService: ConfigService) {}

  getCorsOptions(): CorsOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const corsEnabled = this.configService.get<string>('CORS_ENABLED') !== 'false';
    const allowAllOrigins = this.configService.get<string>('CORS_ALLOW_ALL_ORIGINS') === 'true';
    
    // Configuración ampliada para desarrollo local
    // Incluimos puertos comunes para frameworks frontend como React, Angular, Vue, etc.
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:4200', 
      'http://localhost:8080',
      'http://localhost:5173', // Vite
      'http://localhost:8000', // Otros servidores de desarrollo
      'http://localhost:3001',
      'http://localhost:5000',
      'http://localhost:5500', // Live Server
      'http://localhost:9000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:9000',
      // También incluimos entradas con https para desarrollo local
      'https://localhost:3000',
      'https://localhost:4200',
      'https://localhost:8080',
      'https://localhost:5173',
      'https://localhost:8000',
      'https://localhost:3001',
      'https://localhost:5000',
      'https://localhost:5500',
      'https://localhost:9000',
      'https://127.0.0.1:3000',
      'https://127.0.0.1:4200',
      'https://127.0.0.1:8080',
      'https://127.0.0.1:5173',
      'https://127.0.0.1:8000',
      'https://127.0.0.1:3001',
      'https://127.0.0.1:5000',
      'https://127.0.0.1:5500',
      'https://127.0.0.1:9000',
    ];

    // Configuración de CORS ampliada para desarrollo
    const corsConfig: CorsOptions = {
      origin: allowAllOrigins ? true : (corsEnabled ? defaultOrigins : false),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Content-Disposition', 'Content-Length', 'X-Total-Count'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 3600, // Tiempo que se cachean los resultados de preflight (1 hora)
    };

    return corsConfig;
  }
} 