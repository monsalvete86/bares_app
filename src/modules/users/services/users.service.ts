import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre de usuario o correo ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findPaginated(paginationDto: PaginationDto, filterDto: FilterUserDto): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    console.log('Filtros recibidos:', filterDto); // Log para depuración

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.username) {
        queryBuilder.andWhere('user.username LIKE :username', { username: `%${filterDto.username}%` });
      }
      if (filterDto.fullName) {
        queryBuilder.andWhere('user.fullName LIKE :fullName', { fullName: `%${filterDto.fullName}%` });
      }
      if (filterDto.email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${filterDto.email}%` });
      }
      if (filterDto.role) {
        console.log('Aplicando filtro de rol:', filterDto.role);
        queryBuilder.andWhere('user.role = :role', { role: filterDto.role });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: filterDto.isActive });
      }
    }

    console.log('SQL Query:', queryBuilder.getSql()); // Log para depuración

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`Usuario con nombre de usuario ${username} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    try {
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre de usuario o correo ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
} 