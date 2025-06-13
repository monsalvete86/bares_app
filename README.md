# Sasseri Bares

> 📝 **Nota**: Este archivo README ha sido reorganizado para facilitar el acceso a la información. Se ha estructurado con un índice y secciones claras para que puedas encontrar rápidamente el contexto o referencia sobre cualquier parte del proyecto sin necesidad de recorrer todos los directorios y archivos.

## Índice

1. [Descripción General](#descripción-general)
2. [Tecnologías](#tecnologías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos del Sistema](#módulos-del-sistema)
   - [Módulo de Autenticación (auth)](#módulo-de-autenticación-auth)
   - [Módulo de Usuarios (users)](#módulo-de-usuarios-users)
   - [Módulo de WebSockets (websockets)](#módulo-de-websockets-websockets)
   - [Otros módulos](#otros-módulos)
5. [Guía para Crear Nuevos Módulos](#guía-para-crear-nuevos-módulos)
   - [Estructura de Carpetas](#estructura-de-carpetas)
   - [Patrón para Entidades](#patrón-para-entidades)
   - [Patrón para DTOs](#patrón-para-dtos)
   - [Patrón para Servicios](#patrón-para-servicios)
   - [Patrón para Controladores](#patrón-para-controladores)
   - [Implementación de Paginación y Filtros](#implementación-de-paginación-y-filtros)
6. [Documentación Swagger](#documentación-swagger)
   - [Configuración Base](#configuración-base)
   - [Documentación de Entidades](#documentación-de-entidades)
   - [Documentación de DTOs](#documentación-de-dtos)
   - [Documentación de Controladores](#documentación-de-controladores)
   - [Registro en main.ts](#registro-en-maints)
   - [Mejores Prácticas](#mejores-prácticas-para-swagger)
7. [Variables de Entorno](#variables-de-entorno)
8. [Configuración de CORS](#configuración-de-cors)
9. [Instalación y Ejecución](#instalación-y-ejecución)
10. [Pruebas](#pruebas)
11. [Despliegue](#despliegue)

## Descripción General

Backend diseñado para la administración de bares y restaurantes, pensado en correr en entornos locales, es decir en el equipo del negocio. El sistema permite tener un sistema de administración y vistas de clientes quienes pueden solicitar productos y canciones.

El sistema está diseñado para crear carpetas por módulo del sistema y cada carpeta tiene los archivos requeridos por el módulo (controladores, servicios, DTOs, entidades, etc.).

El sistema maneja dos roles, el primero es el administrador del sistema y el otro es el cliente. El sistema maneja las sesiones de ambos roles.

## Tecnologías

- Nestjs
- Typeorm
- Websockets
- PostgreSQL
- @nestjs/config y dotenv (para variables de entorno)

## Estructura del Proyecto

```
bares_app
  src/
    common/              # Utilidades comunes
      constans/          # Constantes
      decorators/        # Decoradores
      entities/          # Entidades base
      filters/           # Filtros
      guards/            # Guardias
      interceptors/      # Interceptores
      pipes/             # Pipes
    config/              # Configuración de la aplicación
    migrations/          # Migraciones de base de datos
    modules/             # Módulos del sistema
      auth/              # Autenticación y autorización
      users/             # Usuarios administradores
      general-configs/   # Configuraciones del bar
      customers/         # Gestión de clientes
      tables/            # Mesas del bar
      products/          # Productos
      orders/            # Órdenes/facturas
      order-requests/    # Solicitudes de pedidos
      songs-requests/    # Solicitudes de canciones
      reports/           # Reportes y estadísticas
      websockets/        # Comunicación en tiempo real
  test/                  # Pruebas
  .env                   # Variables de entorno
  .env.development       # Variables para desarrollo
  env.example            # Ejemplo de configuración
  nest-cli.json          # Configuración de NestJS
  package.json           # Dependencias
  tsconfig.json          # Configuración de TypeScript
```

Para una estructura completa y detallada, consulte [Estructura Completa del Proyecto](./projectFilesStructure.md).

## Módulos del Sistema

### Módulo de Autenticación (auth)

El módulo de autenticación proporciona funcionalidades para iniciar sesión y autenticar usuarios mediante JWT.

**Rutas:**
- `POST /auth/login` - Iniciar sesión. Requiere username y password en el cuerpo de la solicitud.

**Estrategias de Autenticación:**
- JWT (JSON Web Token) - Para protección de rutas
- Local - Para autenticación con username y password

**Archivos Principales:**
- `auth.module.ts` - Configuración del módulo
- `auth.service.ts` - Lógica de autenticación
- `jwt.strategy.ts` - Estrategia para validación de tokens JWT
- `local.strategy.ts` - Estrategia para validación de credenciales locales
- `jwt-auth.guard.ts` - Guardián para proteger rutas con JWT
- `local-auth.guard.ts` - Guardián para autenticación local

Para más detalles, consulte la [Documentación del Módulo de Autenticación](./src/modules/auth/authInstructs.md).

### Módulo de Usuarios (users)

**Rutas:**
- `GET /users` - Obtener todos los usuarios
- `GET /users/paginated` - Obtener usuarios con paginación y filtros
- `GET /users/:id` - Obtener un usuario específico por ID
- `POST /users` - Crear un nuevo usuario
- `PATCH /users/:id` - Actualizar un usuario existente
- `DELETE /users/:id` - Eliminar un usuario

**Entidad Usuario:**
- `username` - Nombre de usuario (único)
- `password` - Contraseña (se almacena con hash)
- `fullName` - Nombre completo
- `email` - Correo electrónico (único, opcional)
- `role` - Rol del usuario (admin o staff)
- `isActive` - Estado del usuario

**Filtros Disponibles:**
- Por username
- Por fullName
- Por email
- Por role
- Por isActive

**Archivos Principales:**
- `users.module.ts` - Configuración del módulo
- `user.entity.ts` - Definición de la entidad Usuario
- `users.service.ts` - Servicios para operaciones CRUD
- `users.controller.ts` - Controladores para endpoints REST
- `create-user.dto.ts` - DTO para creación de usuarios
- `update-user.dto.ts` - DTO para actualización de usuarios
- `filter-user.dto.ts` - DTO para filtrado de usuarios
- `pagination.dto.ts` - DTO para paginación

Para más detalles, consulte la [Documentación del Módulo de Usuarios](./src/modules/users/usersInstructs.md).

### Módulo de WebSockets (websockets)

El módulo de WebSockets proporciona una capa de comunicación en tiempo real entre el servidor y los clientes, permitiendo actualizaciones instantáneas para varias funcionalidades del sistema.

**Estructura del Módulo:**
- `gateways/` - Contiene los gateways de WebSocket que manejan conexiones y eventos
- `services/` - Servicios que proporcionan una API simplificada para los demás módulos
- `dto/` - Objetos de transferencia de datos para los eventos de WebSocket

**Funcionalidades Principales:**
1. **Actualización de Solicitudes de Canciones:**
   - Notificación en tiempo real cuando se solicitan nuevas canciones
   - Actualización de la lista de canciones solicitadas por mesa
   - Evento: `songRequestUpdate`

2. **Actualización del Estado de Mesas:**
   - Notificación cuando una mesa cambia de estado (disponible/ocupada)
   - Actualización de información detallada sobre el estado de la mesa
   - Evento: `tableStatusUpdate`

3. **Actualización de Solicitudes de Órdenes:**
   - Notificación en tiempo real cuando se solicitan nuevos productos
   - Actualización de la lista de solicitudes de órdenes por mesa
   - Evento: `orderRequestUpdate`

4. **Notificación de Nuevos Pedidos:**
   - Notificación inmediata cuando un cliente crea un nuevo pedido
   - Incluye información detallada como ID de la mesa, cliente, número de productos y total
   - Permite a los administradores recibir alertas instantáneas sobre nuevas solicitudes
   - Evento: `newOrderNotification`

Para más detalles y ejemplos de implementación, consulte la [Documentación del Módulo de WebSockets](./src/modules/websockets/websocketsInstructs.md).

### Otros módulos

- **general-configs**: Configuraciones del bar como el nombre, número de facturación inicial, número de identificación, propietario, teléfono, dirección, email, redes sociales. [Ver documentación](./src/modules/general-configs/generalConfigInstructs.md).
  
- **customers**: Módulo para que el administrador gestione los clientes del bar (CRUD). [Ver documentación](./src/modules/customers/customersInstructs.md).
  
- **tables**: Mesas del bar. [Ver documentación](./src/modules/tables/tablesInstructs.md).
  
- **products**: Productos ofrecidos por el bar con el conteo de existencias. [Ver documentación](./src/modules/products/productsInstructs.md).
  
- **orders**: Órdenes, facturas o cuentas por cliente ligadas a una mesa, incluye el manejo de los ítems o productos de las órdenes.
  
- **order-requests**: Solicitud de pedidos de parte de los clientes. El admin puede modificar el order-request y confirmarlo con lo cual el order-request se carga a orders. [Ver documentación](./src/modules/order-requests/order-requestsInstructs.md).
  
- **songs-requests**: Módulo para gestionar la lista de canciones solicitadas por las mesas. Los clientes pueden solicitar canciones, esto actualiza la lista de canciones solicitadas por mesa. El administrador puede marcar como escuchada la canción, eliminarlas del listado, limpiar todo el listado y agregar nuevas canciones.
  
- **reports**: Módulo para generar reportes y estadísticas del negocio, como ventas totales, productos más vendidos, etc. [Ver documentación](./src/modules/reports/reportsInstructs.md).

## Guía para Crear Nuevos Módulos

Esta sección describe los patrones y estructuras utilizados en el proyecto para facilitar la creación de nuevos módulos basados en el módulo de usuarios (`src/modules/users`).

### Estructura de Carpetas

Cada módulo debe seguir esta estructura de carpetas:
```
src/modules/[nombre-modulo]/
  ├── controllers/          # Controladores REST
  ├── dto/                  # Objetos de transferencia de datos
  ├── entities/             # Entidades de la base de datos
  ├── services/             # Servicios con lógica de negocio
  └── [nombre-modulo].module.ts  # Configuración del módulo
```

### Patrón para Entidades

Todas las entidades deben extender `BaseEntity` que proporciona campos comunes como `id`, `createdAt`, y `updatedAt`:

```typescript
import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('nombre_tabla')
export class MiEntidad extends BaseEntity {
  @ApiProperty({ description: 'Descripción para Swagger', example: 'Ejemplo' })
  @Column({ unique: true })
  campoUnico: string;
  
  // Más columnas...
}
```

### Patrón para DTOs

Los DTOs siguen un patrón consistente con validación y documentación Swagger:

1. **Create DTO**: Define todos los campos requeridos para crear una entidad
```typescript
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMiEntidadDto {
  @ApiProperty({ description: 'Descripción', example: 'Ejemplo' })
  @IsNotEmpty()
  @IsString()
  campo: string;
}
```

2. **Update DTO**: Extiende del Create DTO haciendo todos los campos opcionales
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateMiEntidadDto } from './create-mi-entidad.dto';

export class UpdateMiEntidadDto extends PartialType(CreateMiEntidadDto) {}
```

3. **Filter DTO**: Define campos opcionales para filtrado
```typescript
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMiEntidadDto {
  @ApiPropertyOptional({ description: 'Filtro', example: 'Ejemplo' })
  @IsOptional()
  @IsString()
  campo?: string;
}
```

### Patrón para Servicios

Los servicios implementan la lógica de negocio y operaciones CRUD:

```typescript
@Injectable()
export class MiEntidadService {
  constructor(
    @InjectRepository(MiEntidad)
    private readonly miEntidadRepository: Repository<MiEntidad>,
  ) {}

  // Métodos CRUD: create, findAll, findOne, update, remove
  // Método de paginación: findPaginated
}
```

### Patrón para Controladores

Los controladores definen los endpoints REST con documentación Swagger:

```typescript
@ApiTags('Nombre del Módulo')
@ApiBearerAuth('JWT-auth')
@Controller('ruta-base')
@UseGuards(JwtAuthGuard)  // Protección con JWT
export class MiEntidadController {
  constructor(private readonly miEntidadService: MiEntidadService) {}

  // Endpoints CRUD con decoradores @ApiOperation, @ApiResponse, etc.
}
```

### Implementación de Paginación y Filtros

Para implementar paginación y filtros, sigue estos pasos:

1. En el controlador, recibe los parámetros individualmente:
```typescript
@Get('paginated')
async findPaginated(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('campo') campo?: string,
) {
  const paginationDto = { page: Number(page) || 1, limit: Number(limit) || 10 };
  const filterDto = { campo };
  
  return this.miEntidadService.findPaginated(paginationDto, filterDto);
}
```

2. En el servicio, construye la consulta dinámicamente:
```typescript
async findPaginated(paginationDto, filterDto) {
  const queryBuilder = this.repository.createQueryBuilder('alias');
  
  // Aplicar filtros si existen
  if (filterDto.campo) {
    queryBuilder.andWhere('alias.campo LIKE :campo', { campo: `%${filterDto.campo}%` });
  }
  
  // Aplicar paginación
  const [data, total] = await queryBuilder
    .skip((paginationDto.page - 1) * paginationDto.limit)
    .take(paginationDto.limit)
    .getManyAndCount();
    
  return { data, total, page: paginationDto.page, limit: paginationDto.limit };
}
```

Para más detalles sobre la creación de módulos, consulte la [Guía Completa para Nuevos Módulos](./docs/CreacionModulos.md).

## Documentación Swagger

Esta sección proporciona instrucciones detalladas para implementar Swagger correctamente en cualquier módulo del sistema.

### Configuración Base

El proyecto ya tiene configurado Swagger en `main.ts`. Si necesitas configurarlo en un nuevo proyecto:

```typescript
// Instalar primero los paquetes necesarios
// npm install --save @nestjs/swagger swagger-ui-express

// En main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Dentro de la función bootstrap()
const swaggerConfig = new DocumentBuilder()
  .setTitle('Nombre de la API')
  .setDescription('Descripción de la API')
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
    'JWT-auth', // Nombre del esquema de seguridad
  )
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig, {
  include: [
    // Incluir los módulos que quieres mostrar en Swagger
    ModuloA,
    ModuloB,
  ],
});

SwaggerModule.setup('api/docs', app, document); // Ruta donde estará disponible Swagger
```

### Documentación de Entidades

Cada propiedad de la entidad debe estar documentada con `@ApiProperty`. 

Para ejemplos detallados, consulte la [Guía de Documentación Swagger](./docs/SwaggerGuide.md).

### Documentación de DTOs

Para los DTOs, sigue los patrones establecidos para Create DTO, Update DTO y Filter DTO.

Para ejemplos detallados, consulte la [Guía de Documentación Swagger](./docs/SwaggerGuide.md).

### Documentación de Controladores

En los controladores, usa los decoradores apropiados de Swagger para documentar endpoints, parámetros y respuestas.

Para ejemplos detallados, consulte la [Guía de Documentación Swagger](./docs/SwaggerGuide.md).

### Registro en main.ts

Para que el módulo aparezca en la documentación de Swagger, debes incluirlo en la configuración:

```typescript
// En main.ts
const document = SwaggerModule.createDocument(app, swaggerConfig, {
  include: [
    // Incluir el nuevo módulo aquí
    require('./modules/mi-modulo/mi-modulo.module').MiModuloModule,
  ],
});
```

### Mejores Prácticas para Swagger

1. **Ejemplos realistas**: Proporciona ejemplos realistas en los decoradores `@ApiProperty`.
2. **Descripciones claras**: Escribe descripciones claras y concisas para cada propiedad y endpoint.
3. **Consistencia**: Mantén un estilo consistente en toda la documentación.
4. **Enumeraciones**: Documenta adecuadamente las enumeraciones usando `enum` y `enumName`.
5. **Respuestas de error**: Documenta las posibles respuestas de error usando `@ApiResponse`.
6. **Parámetros de ruta y consulta**: Usa `@ApiParam` y `@ApiQuery` para documentar todos los parámetros.
7. **Recordar agregar los módulos en la configuración de Swagger**

## Variables de Entorno

El proyecto utiliza variables de entorno para configuración. Sigue estos pasos:

1. Renombra el archivo `env` a `.env` para las variables de entorno principales
2. Renombra el archivo `env.development` a `.env.development` para las variables de desarrollo
3. Puedes crear otros archivos como `.env.test` o `.env.production` según sea necesario

Las variables configuradas incluyen:
- Configuración del servidor (puerto, host)
- Configuración de base de datos PostgreSQL
- Configuración de JWT para autenticación
  - `JWT_SECRET`: Clave secreta para firmar tokens JWT
  - `JWT_EXPIRATION`: Tiempo de expiración de los tokens
- Configuración de CORS
  - `CORS_ENABLED`: Habilita o deshabilita CORS
  - `CORS_ALLOW_ALL_ORIGINS`: Permite peticiones desde cualquier origen (útil en desarrollo)

**Nota:** Los archivos `.env` no se envían al repositorio por seguridad.

Para más detalles, consulte la [Guía de Variables de Entorno](./docs/VariablesEntorno.md).

## Configuración de CORS

El proyecto está configurado para manejar Cross-Origin Resource Sharing (CORS), lo que permite que el frontend pueda comunicarse con el backend aunque estén en diferentes dominios o puertos.

### Variables de Entorno para CORS

- `CORS_ENABLED`: Si se establece como `true`, se habilita la funcionalidad CORS. Por defecto está habilitada.
- `CORS_ALLOW_ALL_ORIGINS`: Si se establece como `true`, se permite el acceso desde cualquier origen. Esto es útil durante el desarrollo, pero debe configurarse adecuadamente en producción.

### Configuración Ampliada para Desarrollo Local

El proyecto está configurado para permitir conexiones desde diversos orígenes locales comunes en desarrollo:

- Puertos comunes: 3000, 3001, 4200, 5000, 5173 (Vite), 5500 (Live Server), 8000, 8080, 9000
- Direcciones: tanto `localhost` como `127.0.0.1`
- Protocolos: tanto `http` como `https`

Para más detalles, consulte la [Guía de Configuración CORS](./docs/CORSConfig.md).

## Instalación y Ejecución

```bash
# Instalación de dependencias
$ npm install

# Desarrollo
$ npm run start

# Modo watch
$ npm run start:dev

# Producción
$ npm run start:prod
```

## Pruebas

```bash
# Pruebas unitarias
$ npm run test

# Pruebas e2e
$ npm run test:e2e

# Cobertura de pruebas
$ npm run test:cov
```

## Despliegue

Cuando estés listo para desplegar tu aplicación NestJS en producción, hay algunos pasos clave que puedes seguir para asegurar que funcione lo más eficientemente posible. Consulta la [documentación de despliegue](https://docs.nestjs.com/deployment) para más información.

Si buscas una plataforma basada en la nube para desplegar tu aplicación NestJS, consulta [Mau](https://mau.nestjs.com), nuestra plataforma oficial para desplegar aplicaciones NestJS en AWS. Mau hace que el despliegue sea sencillo y rápido, requiriendo solo unos pocos pasos simples:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Con Mau, puedes desplegar tu aplicación con solo unos clics, permitiéndote concentrarte en construir características en lugar de administrar infraestructura.