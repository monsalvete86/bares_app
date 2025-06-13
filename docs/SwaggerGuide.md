# Guía de Documentación Swagger

Esta guía proporciona instrucciones detalladas para implementar Swagger correctamente en cualquier módulo del sistema Sasseri Bares.

## Configuración Base

El proyecto ya tiene configurado Swagger en `main.ts`. Si necesitas configurarlo en un nuevo proyecto:

```typescript
// Instalar primero los paquetes necesarios
// npm install --save @nestjs/swagger swagger-ui-express

// En main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Dentro de la función bootstrap()
const swaggerConfig = new DocumentBuilder()
  .setTitle('Sasseri Bares API')
  .setDescription('API para la administración de bares y restaurantes')
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
    UsersModule,
    AuthModule,
    TablesModule,
    // ... otros módulos
  ],
});

SwaggerModule.setup('api/docs', app, document); // Ruta donde estará disponible Swagger
```

## Documentación de Entidades

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

### Buenas Prácticas para Documentar Entidades

1. **Incluye ejemplos realistas**: Los ejemplos deben representar valores válidos que podrían usarse en producción.
2. **Usa tipos correctos**: Asegúrate de especificar el tipo correcto para cada propiedad.
3. **Documenta campos opcionales**: Usa `required: false` para campos opcionales.
4. **Documenta valores por defecto**: Usa `default` para mostrar valores predeterminados.
5. **Documenta enumeraciones**: Usa `enum` y `enumName` para documentar valores enumerados.
6. **Usa descripciones claras**: Las descripciones deben ser concisas pero informativas.

## Documentación de DTOs

Para los DTOs, sigue estos patrones:

### Create DTO - Para creación de recursos:

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

### Update DTO - Para actualización (todos los campos opcionales):

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateMiEntidadDto } from './create-mi-entidad.dto';

// PartialType hace que todos los campos sean opcionales
export class UpdateMiEntidadDto extends PartialType(CreateMiEntidadDto) {}
```

### Filter DTO - Para filtros en consultas:

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

### Pagination DTO - Para paginar resultados:

```typescript
import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número de página (empieza desde 1)',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
```

## Documentación de Controladores

En los controladores, usa estos decoradores:

```typescript
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse
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
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos'
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
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite por página', example: 10 })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre', example: 'ejemplo' })
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
    },
    example: true
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
  @ApiParam({ name: 'id', description: 'ID del recurso', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ 
    description: 'Recurso encontrado',
    type: MiEntidad 
  })
  @ApiNotFoundResponse({
    description: 'Recurso no encontrado'
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MiEntidad> {
    return this.miServicio.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un recurso' })
  @ApiParam({ name: 'id', description: 'ID del recurso a actualizar', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ 
    description: 'Recurso actualizado exitosamente',
    type: MiEntidad 
  })
  @ApiNotFoundResponse({
    description: 'Recurso no encontrado'
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos'
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateMiEntidadDto): Promise<MiEntidad> {
    return this.miServicio.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar un recurso' })
  @ApiParam({ name: 'id', description: 'ID del recurso a eliminar', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ description: 'Recurso eliminado exitosamente' })
  @ApiNotFoundResponse({
    description: 'Recurso no encontrado'
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.miServicio.remove(id);
  }
}
```

## Documentación de Respuestas de Error

Es importante documentar las posibles respuestas de error para cada endpoint:

```typescript
@ApiNotFoundResponse({
  description: 'Recurso no encontrado',
  schema: {
    properties: {
      statusCode: { type: 'number', example: 404 },
      message: { type: 'string', example: 'Recurso con ID 123 no encontrado' },
      error: { type: 'string', example: 'Not Found' }
    }
  }
})
```

## Registro en main.ts

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

## Documentación de Esquemas Complejos

Para documentar esquemas más complejos como respuestas anidadas:

```typescript
@ApiOkResponse({
  description: 'Resultado complejo',
  schema: {
    properties: {
      id: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      detalles: {
        type: 'object',
        properties: {
          cantidad: { type: 'number' },
          descripcion: { type: 'string' },
          activo: { type: 'boolean' }
        }
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nombre: { type: 'string' },
            precio: { type: 'number' }
          }
        }
      }
    }
  }
})
```

## Documentación de Seguridad

Para documentar requisitos de autenticación:

```typescript
// En el controlador, para toda la clase
@ApiBearerAuth('JWT-auth')

// O para un método específico
@ApiBearerAuth('JWT-auth')
@Get('endpoint-protegido')
async metodoProtegido() {
  // ...
}
```

## Agrupación de Endpoints

Para organizar mejor la documentación, agrupa los endpoints por funcionalidad:

```typescript
// Grupo principal
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  // ... endpoints generales
}

// Subgrupo
@ApiTags('Usuarios - Roles')
@Controller('users/roles')
export class UserRolesController {
  // ... endpoints relacionados con roles
}
```

## Mejores Prácticas para Swagger

1. **Ejemplos realistas**: Proporciona ejemplos realistas en los decoradores `@ApiProperty`.
2. **Descripciones claras**: Escribe descripciones claras y concisas para cada propiedad y endpoint.
3. **Consistencia**: Mantén un estilo consistente en toda la documentación.
4. **Enumeraciones**: Documenta adecuadamente las enumeraciones usando `enum` y `enumName`.
5. **Respuestas de error**: Documenta las posibles respuestas de error usando `@ApiResponse`.
6. **Parámetros de ruta y consulta**: Usa `@ApiParam` y `@ApiQuery` para documentar todos los parámetros.
7. **Recordar agregar los módulos en la configuración de Swagger**.
8. **Documentar todos los métodos**: No olvides documentar todos los endpoints, incluso los más simples.
9. **Mantener actualizada la documentación**: Actualiza la documentación cuando cambies la implementación.
10. **Probar la interfaz de Swagger**: Verifica que la documentación sea clara y usable navegando por la interfaz de Swagger. 