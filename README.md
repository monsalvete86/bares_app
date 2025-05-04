# Sasseri Bares

## Description General

Backend diseñado para la administración de bares y restaurantes, pensado en correr en entornos locales, es decir en el equipo del negocio. El sistema permite tener un sistema de adminstracion y vistas de clientes quienes puede solicitar productos y canciones.

El sistema esta  diseñado para crear carpetas por modulo del sistema y cada carpeta tiene los archivos requeridos por el modulo (controladores, servicios, DTOs, entidades, etc...). 

El sistema maneja dos roles, el primero es el administrador del sistema y el otro es el cliente. El sistema maneja las sesiones de ambos roles.

## Tecnologias

  - Nestjs
  - Typeorm
  - Websockets
  - Posgresql
  - @nestjs/config y dotenv (para variables de entorno)

## Módulos del sistema 

  - auth            # Autenticacion y autorización usando JWT
  - users           # Usuarios administradores del sistema
  - general-configs # Configuraciones del bar como el nombre, número de facturación inicial, número de identificación, propietario, telefono, direccion, email, redes sociales.
  - customers       # Módulo para que el adminstrador gestione los cilientes del bar (CRUD)
  - tables          # Mesas del bar
  - products        # Productos ofrecidos por el bar con el conteo de existencias.
  - orders          # Ordenes, facturas o cuentas por cliente ligadas a una mesa, incluye el manejo de los items o productos de las ordenes.
  - orders-requests # Solicitud de pedidos de parte de los clientes. El admin puede modificar el order-request y confirmalo con lo cual el order-request se carga a orders
  - song-requests   # modulo para gestionar la lista de canciones solicitadas por las mesas, los clientes pueden solicitar canciones, esto actualiza la lista que canciones solicitadas por mesa. El administrador puede marcar como escuchada la cancion, eliminarlas del listado, limpiar todo el listado y agregar nuevas canciones. El orden de las canciones es por el orden de registro pero de a una cancion mesa activa o rondas de una cancion por mesa activa ordenadas segun el orden de registro.
  - websockets      # Este módulo se encarga de la funcionalidad para actualizar los datos de solicitudes de ordenes de productos, el cambio del estado de la mesa (ocupada/disponible) y el listado de canciones solicitadas.

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

**Implementación:**
- Se utiliza Socket.IO para la comunicación WebSocket
- Los clientes se conectan al gateway principal (`AppGateway`)
- Los demás módulos pueden usar `WebsocketsService` para emitir eventos

**Uso desde Otros Módulos:**
```typescript
// Ejemplo de cómo el módulo de solicitudes de órdenes usa WebSockets
@Injectable()
export class OrderRequestsService {
  constructor(
    private readonly websocketsService: WebsocketsService
    // ... otras dependencias
  ) {}

  async create(createOrderRequestDto: CreateOrderRequestDto): Promise<OrderRequest> {
    // Lógica para crear la solicitud...
    
    // Notificar sobre el nuevo pedido
    this.websocketsService.notifyNewOrder(
      orderRequest.id,
      orderRequest.tableId,
      orderRequest.clientId,
      {
        total: Number(orderRequest.total),
        itemsCount: orderRequest.items.length,
        createdAt: orderRequest.createdAt,
      }
    );
    
    // Actualizar también el listado completo de órdenes para la mesa
    this.websocketsService.notifyOrderRequestUpdate(orderRequest.tableId, tableOrderRequests);
    
    return orderRequest;
  }
}
```

**Conexión desde el Cliente:**
```javascript
// Ejemplo de conexión desde un cliente (frontend)
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Escuchar eventos de notificación de nuevos pedidos
socket.on('newOrderNotification', (data) => {
  console.log(`¡Nuevo pedido recibido para la mesa ${data.tableId}!`);
  console.log(`Total: ${data.orderInfo.total}, Productos: ${data.orderInfo.itemsCount}`);
  // Mostrar notificación al administrador...
});

// Escuchar eventos de actualización de solicitudes de órdenes
socket.on('orderRequestUpdate', (data) => {
  console.log(`Actualización de pedidos para mesa ${data.tableId}`);
  console.log(data.orderRequests);
  // Actualizar la interfaz de usuario...
});

// ... otros eventos
```

**Consideraciones de Seguridad:**
- En producción, configurar CORS para permitir solo orígenes específicos
- Implementar autenticación para las conexiones WebSocket si es necesario
- Validar los datos recibidos antes de procesarlos

**Beneficios:**
- Actualización instantánea de la interfaz de usuario sin necesidad de recargar
- Notificaciones en tiempo real de nuevos pedidos para acelerar la atención al cliente
- Reducción de consultas al servidor mediante comunicación en tiempo real
- Mejora de la experiencia del usuario con notificaciones inmediatas

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

### Documentación Swagger

Para documentar correctamente los endpoints usando Swagger:

1. Usa `@ApiProperty` y `@ApiPropertyOptional` en las entidades y DTOs
2. Define esquemas para enums y tipos específicos
3. Especifica correctamente los tipos de retorno con `@ApiResponse`
4. Para parámetros de consulta, usa `@ApiQuery` con el nombre exacto del parámetro

```typescript
@ApiQuery({ 
  name: 'role', 
  required: false, 
  enum: ['valor1', 'valor2'], 
  description: 'Descripción',
  schema: { 
    type: 'string',
    enum: ['valor1', 'valor2']
  }
})
```

### Consideraciones para Nuevos Módulos

1. **Registro en app.module.ts**: Asegúrate de registrar el nuevo módulo en el módulo principal.
2. **Relaciones**: Define correctamente las relaciones entre entidades usando TypeORM.
3. **Validación**: Implementa validación completa en los DTOs.
4. **Seguridad**: Aplica los guardias de autenticación según sea necesario.
5. **Errores**: Maneja adecuadamente los errores específicos del negocio.
6. **Documentación**: Documenta todos los endpoints y modelos con Swagger.

### Guía para Implementar Swagger en Módulos

Esta sección proporciona instrucciones detalladas para implementar Swagger correctamente en cualquier módulo del sistema.

#### 1. Instalación y Configuración Base (Ya realizada en el proyecto)

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

#### 2. Documentación de Entidades

Cada propiedad de la entidad debe estar documentada con `@ApiProperty`:

```typescript
import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('nombre_tabla')
export class MiEntidad extends BaseEntity {
  @ApiProperty({ 
    description: 'Descripción del campo', 
    example: 'Valor de ejemplo',
    required: true // Por defecto es true
  })
  @Column({ unique: true })
  campoUnico: string;

  @ApiProperty({ 
    description: 'Campo numérico', 
    example: 100,
    type: Number
  })
  @Column()
  campoNumerico: number;

  @ApiProperty({ 
    description: 'Campo opcional', 
    example: 'Valor opcional', 
    required: false,
    nullable: true
  })
  @Column({ nullable: true })
  campoOpcional?: string;

  @ApiProperty({ 
    description: 'Campo con valores fijos', 
    enum: ['valor1', 'valor2', 'valor3'],
    enumName: 'NombreEnum', // Nombre para mostrar en Swagger
    example: 'valor1'
  })
  @Column({
    type: 'enum',
    enum: ['valor1', 'valor2', 'valor3'],
    default: 'valor1',
  })
  campoEnum: string;

  @ApiProperty({ 
    description: 'Campo booleano', 
    example: true, 
    default: false 
  })
  @Column({ default: false })
  campoBooleano: boolean;
}
```

#### 3. Documentación de DTOs

Para los DTOs, sigue estos patrones:

**Create DTO** - Para creación de recursos:

```typescript
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMiEntidadDto {
  @ApiProperty({ 
    description: 'Campo requerido', 
    example: 'Valor de ejemplo' 
  })
  @IsString()
  @IsNotEmpty()
  campoRequerido: string;

  @ApiProperty({ 
    description: 'Campo con longitud mínima', 
    example: 'password123',
    minLength: 6 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  campoConMinLength: string;

  @ApiPropertyOptional({ 
    description: 'Campo opcional', 
    example: 'Valor opcional' 
  })
  @IsString()
  @IsOptional()
  campoOpcional?: string;

  @ApiProperty({ 
    description: 'Campo enum', 
    enum: ['valor1', 'valor2'],
    enumName: 'MiEnum',
    example: 'valor1' 
  })
  @IsEnum(['valor1', 'valor2'])
  @IsNotEmpty()
  campoEnum: string;
}
```

**Update DTO** - Para actualización (todos los campos opcionales):

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateMiEntidadDto } from './create-mi-entidad.dto';

// PartialType hace que todos los campos sean opcionales
export class UpdateMiEntidadDto extends PartialType(CreateMiEntidadDto) {}
```

**Filter DTO**: Para filtros en consultas:

```typescript
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterMiEntidadDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por nombre', 
    example: 'texto' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado', 
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activo?: boolean;

  @ApiPropertyOptional({ 
    description: 'Filtrar por cantidad', 
    example: 10 
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cantidad?: number;
}
```

#### 4. Documentación de Controladores

En los controladores, usa estos decoradores:

```typescript
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';

@ApiTags('Nombre del Módulo') // Agrupa endpoints en Swagger
@ApiBearerAuth('JWT-auth') // Agrega autenticación JWT a todos los endpoints
@Controller('ruta-base')
@UseGuards(JwtAuthGuard)
export class MiController {
  constructor(private readonly miServicio: MiServicio) {}

  @ApiOperation({ summary: 'Crear nuevo recurso' }) // Descripción de la operación
  @ApiCreatedResponse({ 
    description: 'Recurso creado exitosamente',
    type: MiEntidad // Tipo de respuesta para Swagger
  })
  @Post()
  async create(@Body() createDto: CreateMiEntidadDto): Promise<MiEntidad> {
    return this.miServicio.create(createDto);
  }

  @ApiOperation({ summary: 'Obtener todos los recursos' })
  @ApiOkResponse({ 
    description: 'Lista de recursos obtenida',
    type: [MiEntidad] // Array del tipo
  })
  @Get()
  async findAll(): Promise<MiEntidad[]> {
    return this.miServicio.findAll();
  }

  @ApiOperation({ summary: 'Obtener recursos paginados con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite por página' })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre' })
  @ApiQuery({ 
    name: 'tipo', 
    required: false, 
    enum: ['tipo1', 'tipo2'], 
    description: 'Filtrar por tipo',
    schema: { 
      type: 'string',
      enum: ['tipo1', 'tipo2']
    }
  })
  @ApiQuery({ 
    name: 'activo', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de recursos',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/MiEntidad' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @Get('paginated')
  async findPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('nombre') nombre?: string,
    @Query('tipo') tipo?: string,
    @Query('activo') activo?: string,
  ): Promise<{ data: MiEntidad[]; total: number; page: number; limit: number }> {
    // Transformar parámetros
    const paginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto = { 
      nombre, 
      tipo,
      activo: activo === 'true' ? true : activo === 'false' ? false : undefined
    };
    
    return this.miServicio.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un recurso por ID' })
  @ApiParam({ name: 'id', description: 'ID del recurso' })
  @ApiOkResponse({ 
    description: 'Recurso encontrado',
    type: MiEntidad 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MiEntidad> {
    return this.miServicio.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un recurso' })
  @ApiParam({ name: 'id', description: 'ID del recurso a actualizar' })
  @ApiOkResponse({ 
    description: 'Recurso actualizado exitosamente',
    type: MiEntidad 
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateMiEntidadDto): Promise<MiEntidad> {
    return this.miServicio.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar un recurso' })
  @ApiParam({ name: 'id', description: 'ID del recurso a eliminar' })
  @ApiOkResponse({ description: 'Recurso eliminado exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.miServicio.remove(id);
  }
}
```

#### 5. Registro en main.ts

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

#### 6. Mejores Prácticas para Swagger

1. **Ejemplos realistas**: Proporciona ejemplos realistas en los decoradores `@ApiProperty`.
2. **Descripciones claras**: Escribe descripciones claras y concisas para cada propiedad y endpoint.
3. **Consistencia**: Mantén un estilo consistente en toda la documentación.
4. **Enumeraciones**: Documenta adecuadamente las enumeraciones usando `enum` y `enumName`.
5. **Respuestas de error**: Documenta las posibles respuestas de error usando `@ApiResponse`.
6. **Parámetros de ruta y consulta**: Usa `@ApiParam` y `@ApiQuery` para documentar todos los parámetros.
7. **Recordar agrear los módulos en la configuración de Swagger**

Siguiendo estas instrucciones, podrás implementar Swagger de manera rápida y completa en cualquier nuevo módulo que desarrolles en el sistema.

## Variables de entorno

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

**Nota:** Los archivos `.env` no se envían al repositorio por seguridad.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

