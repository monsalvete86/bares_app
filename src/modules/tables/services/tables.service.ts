import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { FilterTableDto } from '../dto/filter-table.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    try {
      const table = this.tableRepository.create(createTableDto);
      return await this.tableRepository.save(table);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Una mesa con ese número ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Table[]> {
    return this.tableRepository.find();
  }

  async findPaginated(paginationDto: PaginationDto, filterDto: FilterTableDto): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tableRepository.createQueryBuilder('table');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.number !== undefined) {
        queryBuilder.andWhere('table.number = :number', { number: filterDto.number });
      }
      if (filterDto.name) {
        queryBuilder.andWhere('table.name LIKE :name', { name: `%${filterDto.name}%` });
      }
      if (filterDto.description) {
        queryBuilder.andWhere('table.description LIKE :description', { description: `%${filterDto.description}%` });
      }
      if (filterDto.isOccupied !== undefined) {
        queryBuilder.andWhere('table.isOccupied = :isOccupied', { isOccupied: filterDto.isOccupied });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('table.isActive = :isActive', { isActive: filterDto.isActive });
      }
    }

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

  async findOne(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return table;
  }

  async findByNumber(number: number): Promise<Table> {
    const table = await this.tableRepository.findOne({ where: { number } });
    if (!table) {
      throw new NotFoundException(`Mesa con número ${number} no encontrada`);
    }
    return table;
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.findOne(id);
    
    try {
      Object.assign(table, updateTableDto);
      return await this.tableRepository.save(table);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Una mesa con ese número ya existe');
      }
      throw error;
    }
  }

  async changeOccupiedStatus(id: string, isOccupied: boolean): Promise<Table> {
    const table = await this.findOne(id);
    table.isOccupied = isOccupied;
    return await this.tableRepository.save(table);
  }

  async remove(id: string): Promise<void> {
    const table = await this.findOne(id);
    await this.tableRepository.remove(table);
  }
} 