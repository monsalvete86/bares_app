import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CorsConfigService {
  constructor(private configService: ConfigService) {}

  getCorsOptions(): CorsOptions {
    // Configuración CORS sin restricciones para desarrollo
    return {
      origin: true,  // Permite cualquier origen
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: '*',  // Permite cualquier cabecera
      exposedHeaders: ['Content-Disposition', 'Content-Length', 'X-Total-Count'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 3600, // 1 hora
    };
  }
} 