import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23505') { // Error de clave duplicada
        throw new ConflictException('Ya existe un producto con este nombre');
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        name: 'ASC'
      }
    });
  }

  async findPaginated(paginationDto: PaginationDto, filterDto: FilterProductDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Aplicar filtros si existen
    if (filterDto) {
      if (filterDto.name) {
        queryBuilder.andWhere('product.name ILIKE :name', { name: `%${filterDto.name}%` });
      }
      if (filterDto.description) {
        queryBuilder.andWhere('product.description ILIKE :description', { description: `%${filterDto.description}%` });
      }
      if (filterDto.minPrice) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filterDto.minPrice });
      }
      if (filterDto.maxPrice) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filterDto.maxPrice });
      }
      if (filterDto.minStock) {
        queryBuilder.andWhere('product.stock >= :minStock', { minStock: filterDto.minStock });
      }
      if (filterDto.type) {
        queryBuilder.andWhere('product.type = :type', { type: filterDto.type });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('product.isActive = :isActive', { isActive: filterDto.isActive });
      }
    }

    // Ordenar por nombre
    queryBuilder.orderBy('product.name', 'ASC');

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    try {
      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un producto con este nombre');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Método para actualizar el stock de productos
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity; // Puede ser positivo (ingreso) o negativo (salida)
    
    if (product.stock < 0) {
      product.stock = 0; // Evitar stock negativo
    }
    
    return this.productRepository.save(product);
  }
} 