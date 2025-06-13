# Guía de Configuración CORS

El proyecto Sasseri Bares está configurado para manejar Cross-Origin Resource Sharing (CORS), lo que permite que el frontend pueda comunicarse con el backend aunque estén en diferentes dominios o puertos. Esta guía explica cómo está configurado CORS en el proyecto y cómo ajustarlo según las necesidades.

## ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es un mecanismo que permite que los recursos restringidos en una página web sean solicitados desde otro dominio fuera del dominio desde el que se sirvió el primer recurso. Por ejemplo, permite que tu frontend en `http://localhost:5173` pueda hacer peticiones a tu backend en `http://localhost:3000`.

## Variables de Entorno para CORS

El proyecto utiliza dos variables de entorno principales para configurar CORS:

- `CORS_ENABLED`: Si se establece como `true`, se habilita la funcionalidad CORS. Por defecto está habilitada.
- `CORS_ALLOW_ALL_ORIGINS`: Si se establece como `true`, se permite el acceso desde cualquier origen. Esto es útil durante el desarrollo, pero debe configurarse adecuadamente en producción.

Estas variables se pueden configurar en los archivos `.env` y `.env.development`:

```
# Configuración de CORS
CORS_ENABLED=true
CORS_ALLOW_ALL_ORIGINS=true
```

## Configuración Ampliada para Desarrollo Local

El proyecto está configurado para permitir conexiones desde diversos orígenes locales comunes en desarrollo:

- **Puertos comunes**: 
  - 3000 (NestJS por defecto)
  - 3001 (Alternativa para NestJS)
  - 4200 (Angular)
  - 5000 (Python/Flask)
  - 5173 (Vite)
  - 5500 (Live Server en VSCode)
  - 8000 (Django)
  - 8080 (Común para varios frameworks)
  - 9000 (Otro puerto común)

- **Direcciones**:
  - `localhost`
  - `127.0.0.1`

- **Protocolos**:
  - `http`
  - `https`

Esto permite una gran flexibilidad durante el desarrollo, permitiéndote usar diferentes frameworks y herramientas frontend sin problemas de CORS.

## Configuración en el Código

La configuración de CORS se define en `src/config/cors.config.ts`:

```typescript
// src/config/cors.config.ts
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const corsConfigFactory = (configService: ConfigService): CorsOptions => {
  const corsEnabled = configService.get<boolean>('CORS_ENABLED', true);
  
  if (!corsEnabled) {
    return { origin: false };
  }
  
  const allowAllOrigins = configService.get<boolean>('CORS_ALLOW_ALL_ORIGINS', false);
  
  if (allowAllOrigins) {
    return {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    };
  }
  
  // Lista de orígenes permitidos para entornos que no permiten todos los orígenes
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4200',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost:9000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:9000',
    // Puedes agregar tus propios orígenes aquí para producción
  ];
  
  return {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
};
```

## Manejo de Certificados SSL

Para desarrollo local, el proyecto está configurado para no rechazar conexiones que no tengan certificados SSL válidos, lo que permite trabajar con `https` en entornos de desarrollo sin necesidad de configurar certificados.

```typescript
// src/main.ts (fragmento para configuración SSL)
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: process.env.NODE_ENV !== 'production' ? {
      rejectUnauthorized: false,
    } : undefined,
  });
  
  // ... resto de la configuración
}
```

## WebSockets y CORS

Los WebSockets también tienen configurado CORS de manera amplia para permitir conexiones desde el frontend. La configuración incluye:

- **Orígenes**: misma configuración que para las solicitudes HTTP normales
- **Cabeceras**: se permiten cabeceras comunes como `Content-Type`, `Authorization`, `Accept`, etc.
- **Credenciales**: se permiten credenciales en las solicitudes
- **Cache**: las respuestas de preflight se cachean durante 1 hora para mejorar el rendimiento

```typescript
// src/modules/websockets/gateways/app.gateway.ts (ejemplo simplificado)
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ALLOW_ALL_ORIGINS === 'true' 
      ? true
      : [
          'http://localhost:3000',
          'http://localhost:5173',
          // ... otros orígenes permitidos
        ],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // ... implementación del gateway
}
```

## Configuración para Producción

En entornos de producción, es recomendable:

1. Establecer `CORS_ALLOW_ALL_ORIGINS=false`
2. Configurar los orígenes específicos que necesiten acceso en el archivo `src/config/cors.config.ts`, añadiendo tus dominios de producción

```typescript
// src/config/cors.config.ts (fragmento para producción)
const allowedOrigins = [
  // Orígenes de desarrollo (pueden mantenerse)
  'http://localhost:3000',
  // ... otros orígenes de desarrollo
  
  // Orígenes de producción (añadir según necesidades)
  'https://mi-aplicacion.com',
  'https://admin.mi-aplicacion.com',
  'https://api.mi-aplicacion.com',
  // Puedes usar comodines para subdominios si es necesario
  // 'https://*.mi-aplicacion.com',
];
```

La configuración recomendada para entornos de producción es:

```
CORS_ENABLED=true
CORS_ALLOW_ALL_ORIGINS=false
```

## Solución de Problemas Comunes de CORS

### Error: "Access-Control-Allow-Origin"

Si recibes errores como:

```
Access to XMLHttpRequest at 'http://localhost:3000/api/users' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Verifica:

1. Que `CORS_ENABLED` esté configurado como `true`
2. Que `CORS_ALLOW_ALL_ORIGINS` esté configurado como `true` (para desarrollo) o que el origen específico esté en la lista de orígenes permitidos
3. Que el servidor NestJS esté ejecutándose correctamente

### Error: "Method not allowed"

Si recibes errores relacionados con el método HTTP:

```
Access to XMLHttpRequest at 'http://localhost:3000/api/users' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
```

Verifica que el método que estás utilizando esté incluido en la lista `methods` de la configuración CORS.

### Error: "Headers not allowed"

Si recibes errores relacionados con las cabeceras:

```
Access to XMLHttpRequest at 'http://localhost:3000/api/users' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Request header field custom-header is not allowed by Access-Control-Allow-Headers in preflight response.
```

Asegúrate de incluir todas las cabeceras que utilices en la lista `allowedHeaders` de la configuración CORS.

## Pruebas de CORS

Para verificar que tu configuración CORS funciona correctamente, puedes usar:

```javascript
// Desde la consola del navegador o un archivo JavaScript en el frontend
fetch('http://localhost:3000/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu-token-jwt'
  },
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

O utilizando herramientas como Postman para simular solicitudes desde diferentes orígenes.

## Consideraciones de Seguridad

1. **No permitas todos los orígenes en producción**: Usa `CORS_ALLOW_ALL_ORIGINS=false` y especifica los orígenes exactos
2. **Limita los métodos permitidos**: Solo permite los métodos que realmente necesitas
3. **Limita las cabeceras permitidas**: Solo permite las cabeceras que tu aplicación utiliza
4. **Considera si necesitas credentials**: El modo `credentials: true` permite enviar cookies, lo cual puede ser un riesgo de seguridad si no se maneja adecuadamente
5. **Revisa regularmente tu política CORS**: Actualiza la lista de orígenes permitidos según evoluciona tu aplicación 