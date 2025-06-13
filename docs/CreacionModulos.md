# Guía Completa para Crear Nuevos Módulos

Esta guía detalla los patrones y estructuras utilizados en el proyecto Sasseri Bares para facilitar la creación de nuevos módulos basados en el módulo de usuarios (`src/modules/users`).

## Estructura de Carpetas

Cada módulo debe seguir esta estructura de carpetas:
```
src/modules/[nombre-modulo]/
  ├── controllers/          # Controladores REST
  ├── dto/                  # Objetos de transferencia de datos
  ├── entities/             # Entidades de la base de datos
  ├── services/             # Servicios con lógica de negocio
  └── [nombre-modulo].module.ts  # Configuración del módulo
```

## Patrón para Entidades

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

## Patrón para DTOs

Los DTOs siguen un patrón consistente con validación y documentación Swagger:

### 1. Create DTO

Define todos los campos requeridos para crear una entidad:

```typescript
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMiEntidadDto {
  @ApiProperty({ 
    description: 'Nombre único de la entidad', 
    example: 'entidad-123' 
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
  
  @ApiProperty({ 
    description: 'Descripción detallada', 
    example: 'Esta es una descripción de ejemplo' 
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;
  
  @ApiPropertyOptional({ 
    description: 'Correo electrónico de contacto', 
    example: 'contacto@ejemplo.com' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
```

### 2. Update DTO

Extiende del Create DTO haciendo todos los campos opcionales:

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateMiEntidadDto } from './create-mi-entidad.dto';

export class UpdateMiEntidadDto extends PartialType(CreateMiEntidadDto) {}
```

### 3. Filter DTO

Define campos opcionales para filtrado:

```typescript
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterMiEntidadDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por nombre', 
    example: 'entidad' 
  })
  @IsOptional()
  @IsString()
  nombre?: string;
  
  @ApiPropertyOptional({ 
    description: 'Filtrar por descripción', 
    example: 'descripción' 
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
  
  @ApiPropertyOptional({ 
    description: 'Filtrar por estado activo', 
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activo?: boolean;
}
```

## Patrón para Servicios

Los servicios implementan la lógica de negocio y operaciones CRUD:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiEntidad } from '../entities/mi-entidad.entity';
import { CreateMiEntidadDto } from '../dto/create-mi-entidad.dto';
import { UpdateMiEntidadDto } from '../dto/update-mi-entidad.dto';
import { FilterMiEntidadDto } from '../dto/filter-mi-entidad.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class MiEntidadService {
  constructor(
    @InjectRepository(MiEntidad)
    private readonly miEntidadRepository: Repository<MiEntidad>,
  ) {}

  // Crear una nueva entidad
  async create(createMiEntidadDto: CreateMiEntidadDto): Promise<MiEntidad> {
    const newEntity = this.miEntidadRepository.create(createMiEntidadDto);
    return this.miEntidadRepository.save(newEntity);
  }

  // Obtener todas las entidades
  async findAll(): Promise<MiEntidad[]> {
    return this.miEntidadRepository.find();
  }

  // Obtener una entidad por ID
  async findOne(id: string): Promise<MiEntidad> {
    const entity = await this.miEntidadRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
    }
    return entity;
  }

  // Obtener entidades con paginación y filtros
  async findPaginated(
    paginationDto: PaginationDto,
    filterDto: FilterMiEntidadDto,
  ): Promise<{ data: MiEntidad[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.miEntidadRepository.createQueryBuilder('entidad');
    
    // Aplicar filtros si existen
    if (filterDto.nombre) {
      queryBuilder.andWhere('entidad.nombre LIKE :nombre', { 
        nombre: `%${filterDto.nombre}%` 
      });
    }
    
    if (filterDto.descripcion) {
      queryBuilder.andWhere('entidad.descripcion LIKE :descripcion', { 
        descripcion: `%${filterDto.descripcion}%` 
      });
    }
    
    if (filterDto.activo !== undefined) {
      queryBuilder.andWhere('entidad.activo = :activo', { 
        activo: filterDto.activo 
      });
    }
    
    // Aplicar paginación
    queryBuilder.skip(skip).take(limit);
    
    // Obtener resultados
    const [data, total] = await queryBuilder.getManyAndCount();
    
    return {
      data,
      total,
      page,
      limit,
    };
  }

  // Actualizar una entidad
  async update(id: string, updateMiEntidadDto: UpdateMiEntidadDto): Promise<MiEntidad> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateMiEntidadDto);
    return this.miEntidadRepository.save(entity);
  }

  // Eliminar una entidad
  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.miEntidadRepository.remove(entity);
  }
}
```

## Patrón para Controladores

Los controladores definen los endpoints REST con documentación Swagger:

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiCreatedResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MiEntidadService } from '../services/mi-entidad.service';
import { MiEntidad } from '../entities/mi-entidad.entity';
import { CreateMiEntidadDto } from '../dto/create-mi-entidad.dto';
import { UpdateMiEntidadDto } from '../dto/update-mi-entidad.dto';
import { FilterMiEntidadDto } from '../dto/filter-mi-entidad.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@ApiTags('Mi Módulo')
@ApiBearerAuth('JWT-auth')
@Controller('mi-modulo')
@UseGuards(JwtAuthGuard)  // Protección con JWT
export class MiEntidadController {
  constructor(private readonly miEntidadService: MiEntidadService) {}

  @ApiOperation({ summary: 'Crear nueva entidad' })
  @ApiCreatedResponse({ 
    description: 'Entidad creada exitosamente',
    type: MiEntidad
  })
  @Post()
  async create(@Body() createMiEntidadDto: CreateMiEntidadDto): Promise<MiEntidad> {
    return this.miEntidadService.create(createMiEntidadDto);
  }

  @ApiOperation({ summary: 'Obtener todas las entidades' })
  @ApiOkResponse({ 
    description: 'Lista de entidades obtenida',
    type: [MiEntidad]
  })
  @Get()
  async findAll(): Promise<MiEntidad[]> {
    return this.miEntidadService.findAll();
  }

  @ApiOperation({ summary: 'Obtener entidades paginadas con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite por página' })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Filtrar por nombre' })
  @ApiQuery({ name: 'descripcion', required: false, type: String, description: 'Filtrar por descripción' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  @ApiOkResponse({ 
    description: 'Lista paginada de entidades',
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
    @Query('descripcion') descripcion?: string,
    @Query('activo') activo?: string,
  ): Promise<{ data: MiEntidad[]; total: number; page: number; limit: number }> {
    // Transformar parámetros
    const paginationDto: PaginationDto = { 
      page: Number(page) || 1, 
      limit: Number(limit) || 10 
    };
    
    const filterDto: FilterMiEntidadDto = { 
      nombre, 
      descripcion,
      activo: activo === 'true' ? true : activo === 'false' ? false : undefined
    };
    
    return this.miEntidadService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener una entidad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la entidad' })
  @ApiOkResponse({ 
    description: 'Entidad encontrada',
    type: MiEntidad 
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MiEntidad> {
    return this.miEntidadService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una entidad' })
  @ApiParam({ name: 'id', description: 'ID de la entidad a actualizar' })
  @ApiOkResponse({ 
    description: 'Entidad actualizada exitosamente',
    type: MiEntidad 
  })
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateMiEntidadDto: UpdateMiEntidadDto
  ): Promise<MiEntidad> {
    return this.miEntidadService.update(id, updateMiEntidadDto);
  }

  @ApiOperation({ summary: 'Eliminar una entidad' })
  @ApiParam({ name: 'id', description: 'ID de la entidad a eliminar' })
  @ApiOkResponse({ description: 'Entidad eliminada exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.miEntidadService.remove(id);
  }
}
```

## Implementación del Módulo

Para configurar el módulo completo:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiEntidad } from './entities/mi-entidad.entity';
import { MiEntidadController } from './controllers/mi-entidad.controller';
import { MiEntidadService } from './services/mi-entidad.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MiEntidad]),
  ],
  controllers: [MiEntidadController],
  providers: [MiEntidadService],
  exports: [MiEntidadService], // Exportar si otros módulos necesitan usar este servicio
})
export class MiModuloModule {}
```

## Registro en el Módulo Principal

Asegúrate de registrar el nuevo módulo en el módulo principal (`app.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { MiModuloModule } from './modules/mi-modulo/mi-modulo.module';
// ... otros imports

@Module({
  imports: [
    // ... otros módulos
    MiModuloModule,
  ],
  // ... resto de la configuración
})
export class AppModule {}
```

## Consideraciones para Nuevos Módulos

1. **Registro en app.module.ts**: Asegúrate de registrar el nuevo módulo en el módulo principal.
2. **Relaciones**: Define correctamente las relaciones entre entidades usando TypeORM.
3. **Validación**: Implementa validación completa en los DTOs.
4. **Seguridad**: Aplica los guardias de autenticación según sea necesario.
5. **Errores**: Maneja adecuadamente los errores específicos del negocio.
6. **Documentación**: Documenta todos los endpoints y modelos con Swagger.
7. **Tests**: Implementa pruebas unitarias y de integración para el nuevo módulo.

## Ejemplo de Relaciones Entre Entidades

Para implementar relaciones entre entidades, sigue este ejemplo:

```typescript
import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OtraEntidad } from '../../otro-modulo/entities/otra-entidad.entity';
import { EntidadHija } from './entidad-hija.entity';

@Entity('mi_entidad')
export class MiEntidad extends BaseEntity {
  @ApiProperty({ description: 'Nombre de la entidad', example: 'Ejemplo' })
  @Column({ unique: true })
  nombre: string;
  
  // Relación muchos a uno
  @ApiProperty({ description: 'Entidad relacionada', type: () => OtraEntidad })
  @ManyToOne(() => OtraEntidad, otraEntidad => otraEntidad.misEntidades)
  @JoinColumn({ name: 'otra_entidad_id' })
  otraEntidad: OtraEntidad;
  
  @Column({ name: 'otra_entidad_id', nullable: true })
  otraEntidadId: string;
  
  // Relación uno a muchos
  @ApiProperty({ description: 'Entidades hijas', type: [EntidadHija] })
  @OneToMany(() => EntidadHija, entidadHija => entidadHija.miEntidad)
  entidadesHijas: EntidadHija[];
}
```

## Manejo de Errores Específicos

Para manejar errores específicos del negocio, crea filtros de excepciones personalizados:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class MiEntidadException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

@Catch(MiEntidadException)
export class MiEntidadExceptionFilter implements ExceptionFilter {
  catch(exception: MiEntidadException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}
```

## Documentación del Módulo

Crea un archivo de documentación detallada para el módulo, siguiendo el patrón de otros módulos:

```markdown
# Mi Módulo - Documentación

Este módulo permite gestionar entidades del tipo MiEntidad.

## Endpoints

### Crear una nueva entidad
- **URL**: POST /mi-modulo
- **Body**: CreateMiEntidadDto
- **Response**: MiEntidad
- **Descripción**: Crea una nueva entidad.

### Obtener todas las entidades
- **URL**: GET /mi-modulo
- **Response**: MiEntidad[]
- **Descripción**: Obtiene todas las entidades.

...y así sucesivamente para cada endpoint.

## Ejemplos de Uso

```typescript
// Ejemplo de creación de una entidad
const nuevaEntidad = {
  nombre: 'Mi Entidad 1',
  descripcion: 'Esta es una entidad de ejemplo',
  email: 'contacto@ejemplo.com'
};

// POST /mi-modulo
```

## Integración con Otros Módulos

Ejemplo de cómo este módulo se integra con otros módulos del sistema...
```

Siguiendo esta guía completa, podrás implementar nuevos módulos en el sistema de manera consistente y mantenible. 