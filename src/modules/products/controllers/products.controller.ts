import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Product, ProductType } from '../entities/product.entity';
import { 
  ApiBearerAuth, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags,
  ApiResponse,
  getSchemaPath 
} from '@nestjs/swagger';

@ApiTags('Productos')
@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiCreatedResponse({ 
    description: 'Producto creado exitosamente',
    type: Product 
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Ya existe un producto con este nombre' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiOkResponse({ 
    description: 'Lista de todos los productos',
    type: [Product] 
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener productos paginados con filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de registros por página' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrar por nombre del producto' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Filtrar por descripción' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Filtrar por precio mínimo' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Filtrar por precio máximo' })
  @ApiQuery({ name: 'minStock', required: false, type: Number, description: 'Filtrar por stock mínimo' })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ProductType, 
    description: 'Filtrar por tipo de producto',
    schema: { 
      type: 'string',
      enum: Object.values(ProductType)
    }
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    type: Boolean, 
    description: 'Filtrar por estado (activo/inactivo)',
    schema: {
      type: 'boolean'
    }
  })
  @ApiOkResponse({ 
    description: 'Lista paginada de productos',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Product) }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Get('paginated')
  async findPaginated(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minStock') minStock?: string,
    @Query('type') type?: ProductType,
    @Query('isActive') isActive?: string,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    // Convertir parámetros según sea necesario
    const paginationDto: PaginationDto = { 
      page: page ? Number(page) : 1, 
      limit: limit ? Number(limit) : 10 
    };
    
    const filterDto: FilterProductDto = { 
      name, 
      description, 
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minStock: minStock ? Number(minStock) : undefined,
      type,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    };
    
    return this.productsService.findPaginated(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiOkResponse({ 
    description: 'Producto encontrado',
    type: Product 
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar', type: String })
  @ApiOkResponse({ 
    description: 'Producto actualizado exitosamente',
    type: Product 
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un producto con este nombre' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Actualizar el stock de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar el stock', type: String })
  @ApiQuery({ name: 'quantity', required: true, type: Number, description: 'Cantidad a agregar o quitar del stock (puede ser positivo o negativo)' })
  @ApiOkResponse({ 
    description: 'Stock del producto actualizado',
    type: Product 
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string, 
    @Query('quantity') quantity: string,
  ): Promise<Product> {
    const quantityNum = Number(quantity);
    return this.productsService.updateStock(id, quantityNum);
  }

  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar', type: String })
  @ApiOkResponse({ description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
} 