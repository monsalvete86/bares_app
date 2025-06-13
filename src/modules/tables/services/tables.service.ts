import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import { FilterTableDto } from '../dto/filter-table.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { TableDetailDto, TableDetailOrderDto, TableDetailOrderItemDto } from '../dto/table-detail.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { OrderRequest } from 'src/modules/order-requests/entities/order-request.entity';
import { WebsocketsService } from '../../websockets/services/websockets.service';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly websocketsService: WebsocketsService
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

  /**
   * Obtiene los detalles completos de una mesa, incluyendo sus órdenes activas con productos y clientes
   * @param id - ID de la mesa
   * @returns Detalle completo de la mesa
   */
  async findDetailedTableById(id: string): Promise<TableDetailDto> {
    try {
      // Buscar la mesa básica primero para verificar que existe
      const tableExists = await this.tableRepository.findOne({
        where: { id },
      });

      if (!tableExists) {
        throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
      }

      // Buscar la mesa con todas sus relaciones
      // En lugar de utilizar findOne con relaciones, usaremos QueryBuilder
      // para tener más control sobre las consultas y la estructura resultante
      const table = await this.tableRepository
        .createQueryBuilder('table')
        .leftJoinAndSelect('table.orders', 'orders')
        .leftJoinAndSelect('orders.client', 'orderClient')
        .leftJoinAndSelect('orders.items', 'orderItems')
        .leftJoinAndSelect('orderItems.product', 'orderItemProducts')
        .leftJoinAndSelect('table.customers', 'customers')
        .leftJoinAndSelect('table.orderRequests', 'orderRequests')
        .leftJoinAndSelect('orderRequests.client', 'orderRequestClient')
        .leftJoinAndSelect('orderRequests.items', 'orderRequestItems')
        .leftJoinAndSelect('orderRequestItems.product', 'orderRequestItemProducts')
        .where('table.id = :id', { id })
        .getOne();

      if (!table) {
        throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
      }

      // Garantizar que las relaciones siempre sean arrays
      const orders = Array.isArray(table.orders) ? table.orders : (table.orders ? [table.orders] : []);
      const customers = Array.isArray(table.customers) ? table.customers : (table.customers ? [table.customers] : []);
      const orderRequests = Array.isArray(table.orderRequests) ? table.orderRequests : (table.orderRequests ? [table.orderRequests] : []);

      // Filtrar solo órdenes activas (no canceladas y activas)
      const activeOrders = orders
        .filter(order => order && order.isActive && order.status !== 'cancelled')
        .map(order => {
          // Garantizar que los items siempre sean un array
          const items = Array.isArray(order.items) ? order.items : (order.items ? [order.items] : []);
          // Transformar cada orden al formato requerido con detalles de productos
          const orderDto: TableDetailOrderDto = {
            id: order.id,
            client: order.client,
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt,
            items: items
              .map(item => {
                // Transformar cada item con el nombre del producto
                if (item && item.product) {
                  return {
                    id: item.id,
                    productId: item.productId,
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: Number(item.unitPrice),
                    subtotal: Number(item.subtotal)
                  } as TableDetailOrderItemDto;
                }
                return null;
              })
              .filter((item): item is TableDetailOrderItemDto => Boolean(item)) // Filter y typecast en una línea
          };
          return orderDto;
        });

      // Filtrar solo las solicitudes de órdenes pendientes (no completadas)
      const pendingOrderRequests = orderRequests
        .filter(orderRequest => orderRequest && !orderRequest.isCompleted);

      // Construir el DTO de respuesta
      const tableDetailDto: TableDetailDto = {
        id: table.id,
        number: table.number,
        name: table.name,
        description: table.description,
        isOccupied: table.isOccupied,
        isActive: table.isActive,
        customers: customers.filter(customer => customer && customer.isActive),
        activeOrders: activeOrders,
        pendingOrderRequests: pendingOrderRequests,
        createdAt: table.createdAt,
        updatedAt: table.updatedAt
      };

      return tableDetailDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener detalles de la mesa: ${error.message}`);
    }
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.findOne(id);
    
    try {
      const previousOccupiedStatus = table.isOccupied;
      Object.assign(table, updateTableDto);
      const updatedTable = await this.tableRepository.save(table);
      
      // Si cambió el estado de ocupación, notificar por websocket
      if (previousOccupiedStatus !== updatedTable.isOccupied) {
        this.websocketsService.notifyTableStatusUpdate(updatedTable.id, {
          isOccupied: updatedTable.isOccupied,
          updatedAt: updatedTable.updatedAt
        });
      }
      
      return updatedTable;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Una mesa con ese número ya existe');
      }
      throw error;
    }
  }

  async changeOccupiedStatus(id: string, isOccupied: boolean): Promise<Table> {
    const table = await this.findOne(id);
    
    // Si el estado no cambió, retornar la mesa sin modificar
    if (table.isOccupied === isOccupied) {
      return table;
    }
    
    // Actualizar el estado de ocupación
    table.isOccupied = isOccupied;
    const updatedTable = await this.tableRepository.save(table);
    
    // Notificar cambio de estado por websocket
    this.websocketsService.notifyTableStatusUpdate(updatedTable.id, {
      isOccupied: updatedTable.isOccupied,
      updatedAt: updatedTable.updatedAt
    });
    
    return updatedTable;
  }

  async remove(id: string): Promise<void> {
    const table = await this.findOne(id);
    await this.tableRepository.remove(table);
  }
} 