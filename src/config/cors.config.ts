import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CorsConfigService {
  constructor(private configService: ConfigService) {}

  getCorsOptions(): CorsOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const corsEnabled = this.configService.get<string>('CORS_ENABLED') !== 'false';
    
    // Configuración por defecto para desarrollo local
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:4200', 
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:8080',
    ];

    return {
      origin: corsEnabled ? defaultOrigins : false,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    };
  }
} 