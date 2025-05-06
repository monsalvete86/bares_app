import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiOkResponse({
    description: 'Lista de todos los usuarios',
    type: [User],
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuarios paginados con filtros' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Límite de registros por página',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'Filtrar por nombre de usuario',
  })
  @ApiQuery({
    name: 'fullName',
    required: false,
    type: String,
    description: 'Filtrar por nombre completo',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filtrar por correo electrónico',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['admin', 'staff'],
    description: 'Filtrar por rol',
    schema: {
      type: 'string',
      enum: ['admin', 'staff'],
    },
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado (activo/inactivo)',
    schema: {
      type: 'boolean',
    },
  })
  @ApiOkResponse({
    description: 'Lista paginada de usuarios',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/User' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @Get('paginated')
  async findPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('username') username?: string,
    @Query('fullName') fullName?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    console.log('Role filter:', role);
    console.log('isActive filter:', isActive);

    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const filterDto: FilterUserDto = {
      username,
      fullName,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role: role as any,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    };

    return this.usersService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: User,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a actualizar' })
  @ApiOkResponse({
    description: 'Usuario actualizado exitosamente',
    type: User,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiOkResponse({ description: 'Usuario eliminado exitosamente' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
