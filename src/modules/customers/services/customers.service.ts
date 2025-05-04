import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { FilterCustomerDto } from '../dto/filter-customer.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('La mesa especificada no existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['table'] });
  }

  async findPaginated(paginationDto: PaginationDto, filterDto: FilterCustomerDto): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    queryBuilder.leftJoinAndSelect('customer.table', 'table');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.name) {
        queryBuilder.andWhere('customer.name LIKE :name', { name: `%${filterDto.name}%` });
      }
      if (filterDto.tableId) {
        queryBuilder.andWhere('customer.tableId = :tableId', { tableId: filterDto.tableId });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('customer.isActive = :isActive', { isActive: filterDto.isActive });
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

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ 
      where: { id },
      relations: ['table']
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    
    try {
      Object.assign(customer, updateCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException('La mesa especificada no existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
} 