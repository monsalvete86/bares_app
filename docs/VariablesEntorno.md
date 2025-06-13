# Guía de Variables de Entorno

El proyecto Sasseri Bares utiliza variables de entorno para configurar diferentes aspectos de la aplicación, permitiendo adaptarse a distintos entornos (desarrollo, pruebas, producción) sin cambiar el código.

## Archivos de Configuración

El proyecto utiliza los siguientes archivos para la configuración de variables de entorno:

1. `.env` - Archivo principal de variables de entorno (se debe crear basado en el archivo `env`)
2. `.env.development` - Variables específicas para entorno de desarrollo (se debe crear basado en el archivo `env.development`)
3. `.env.test` - Variables para entorno de pruebas (opcional)
4. `.env.production` - Variables para entorno de producción (opcional)

**Importante:** Los archivos `.env` no se incluyen en el repositorio por razones de seguridad. Debes crear tus propios archivos basados en los templates proporcionados.

## Instalación Inicial

Para configurar correctamente las variables de entorno:

1. Renombra el archivo `env` a `.env`
2. Renombra el archivo `env.development` a `.env.development`
3. Ajusta los valores según tu entorno específico

## Variables Disponibles

### Configuración del Servidor

```
# Configuración del servidor
PORT=3000
HOST=localhost
```

- `PORT`: Puerto en el que correrá la aplicación
- `HOST`: Host donde se ejecutará la aplicación

### Configuración de la Base de Datos (PostgreSQL)

```
# Configuración de la base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=bares_db
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=true
```

- `DATABASE_HOST`: Host de la base de datos PostgreSQL
- `DATABASE_PORT`: Puerto de la base de datos
- `DATABASE_USERNAME`: Usuario para conectarse a la base de datos
- `DATABASE_PASSWORD`: Contraseña del usuario
- `DATABASE_NAME`: Nombre de la base de datos
- `DATABASE_SYNCHRONIZE`: Si se debe sincronizar automáticamente el esquema (usar `false` en producción)
- `DATABASE_LOGGING`: Si se deben registrar las consultas SQL

### Configuración de JWT (Autenticación)

```
# Configuración de JWT
JWT_SECRET=secreto_muy_seguro_cambiar_en_produccion
JWT_EXPIRATION=1d
```

- `JWT_SECRET`: Clave secreta para firmar los tokens JWT (¡cambia esto en producción!)
- `JWT_EXPIRATION`: Tiempo de expiración del token (formato: `60`, `"2 days"`, `"10h"`, `"7d"`)

### Configuración de CORS

```
# Configuración de CORS
CORS_ENABLED=true
CORS_ALLOW_ALL_ORIGINS=true
```

- `CORS_ENABLED`: Si se habilita CORS (`true` o `false`)
- `CORS_ALLOW_ALL_ORIGINS`: Si se permiten peticiones desde cualquier origen (`true` o `false`)

## Configuración Específica de Entornos

### Desarrollo

El archivo `.env.development` puede contener configuraciones específicas para desarrollo:

```
# Entorno de desarrollo
NODE_ENV=development
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=true
CORS_ALLOW_ALL_ORIGINS=true
```

### Producción

Para entornos de producción, se recomienda:

```
# Entorno de producción
NODE_ENV=production
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
CORS_ALLOW_ALL_ORIGINS=false
```

## Configuración Avanzada

### Múltiples Bases de Datos

Si necesitas configurar múltiples bases de datos:

```
# Base de datos principal
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=bares_db

# Base de datos secundaria
SECONDARY_DB_HOST=localhost
SECONDARY_DB_PORT=5432
SECONDARY_DB_USERNAME=postgres
SECONDARY_DB_PASSWORD=postgres
SECONDARY_DB_NAME=bares_secondary_db
```

### Opciones de Seguridad Adicionales

```
# Seguridad adicional
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX=100           # 100 peticiones máximo
COOKIE_SECRET=secreto_para_cookies
```

## Uso en el Código

Las variables de entorno se utilizan en el código a través del módulo `@nestjs/config`:

```typescript
// En cualquier servicio o controlador
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MiServicio {
  constructor(private configService: ConfigService) {}

  ejemploMetodo() {
    // Acceder a una variable de entorno
    const puerto = this.configService.get<number>('PORT');
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    
    // Con valor por defecto si no existe
    const timeout = this.configService.get<number>('TIMEOUT', 5000);
    
    // ... resto del código
  }
}
```

## Validación de Variables de Entorno

Para asegurar que todas las variables de entorno requeridas estén presentes:

```typescript
// src/config/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsBoolean, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;

  @IsString()
  JWT_SECRET: string;

  // ... otras variables
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
```

Y luego usar esta validación en el módulo de configuración:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    // ... otros módulos
  ],
})
export class AppModule {}
```

## Recomendaciones de Seguridad

1. **No incluir archivos `.env` en el repositorio**: Asegúrate de que estén en `.gitignore`
2. **Utilizar secretos fuertes**: Especialmente para `JWT_SECRET` y otras claves
3. **Configuración distinta por entorno**: Usa configuraciones específicas para desarrollo/producción
4. **Validar las variables**: Implementa validación para asegurar que todas las variables requeridas estén definidas
5. **Gestión segura de secretos en producción**: Considera usar servicios como AWS Secrets Manager o HashiCorp Vault 