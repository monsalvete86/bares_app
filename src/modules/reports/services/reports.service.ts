import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { SalesReportDto, SalesDetailDto, TopProductDto } from '../dto/sales-report.dto';
import { SalesFilterDto } from '../dto/sales-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getSalesSummary(filter: SalesFilterDto): Promise<SalesReportDto> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .select('SUM(order.total)', 'totalSales')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('AVG(order.total)', 'averageOrderValue')
      .where('order.status = :status', { status: 'completed' });

    // Aplicar filtros
    this.applyFilters(queryBuilder, filter);

    const result = await queryBuilder.getRawOne();

    return {
      totalSales: parseFloat(result.totalSales || '0'),
      totalOrders: parseInt(result.totalOrders || '0', 10),
      averageOrderValue: parseFloat(result.averageOrderValue || '0'),
    };
  }

  async getSalesTimeline(filter: SalesFilterDto): Promise<SalesDetailDto[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .select('DATE(order.createdAt)', 'date')
      .addSelect('SUM(order.total)', 'total')
      .addSelect('COUNT(order.id)', 'ordersCount')
      .where('order.status = :status', { status: 'completed' })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC');

    // Aplicar filtros
    this.applyFilters(queryBuilder, filter);

    const results = await queryBuilder.getRawMany();

    return results.map(row => ({
      date: row.date,
      total: parseFloat(row.total || '0'),
      ordersCount: parseInt(row.ordersCount || '0', 10),
    }));
  }

  async getTopProducts(filter: SalesFilterDto, limit: number = 10): Promise<TopProductDto[]> {
    const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('orderItem.product', 'product')
      .select('orderItem.productId', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(orderItem.quantity)', 'quantity')
      .addSelect('SUM(orderItem.subtotal)', 'totalSales')
      .where('order.status = :status', { status: 'completed' })
      .groupBy('orderItem.productId')
      .addGroupBy('product.name')
      .orderBy('totalSales', 'DESC')
      .limit(limit);

    // Aplicar filtros a la orden
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(filter.startDate),
        endDate: new Date(filter.endDate),
      });
    } else if (filter.startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(filter.startDate),
      });
    } else if (filter.endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', {
        endDate: new Date(filter.endDate),
      });
    }

    if (filter.tableId) {
      queryBuilder.andWhere('order.tableId = :tableId', { tableId: filter.tableId });
    }

    if (filter.clientId) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId: filter.clientId });
    }

    if (filter.isActive !== undefined) {
      queryBuilder.andWhere('order.isActive = :isActive', { isActive: filter.isActive });
    }

    const results = await queryBuilder.getRawMany();

    return results.map(row => ({
      productId: row.productId,
      productName: row.productName,
      quantity: parseInt(row.quantity || '0', 10),
      totalSales: parseFloat(row.totalSales || '0'),
    }));
  }

  private applyFilters(queryBuilder: any, filter: SalesFilterDto) {
    if (filter.startDate && filter.endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(filter.startDate),
        endDate: new Date(filter.endDate),
      });
    } else if (filter.startDate) {
      queryBuilder.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(filter.startDate),
      });
    } else if (filter.endDate) {
      queryBuilder.andWhere('order.createdAt <= :endDate', {
        endDate: new Date(filter.endDate),
      });
    }

    if (filter.tableId) {
      queryBuilder.andWhere('order.tableId = :tableId', { tableId: filter.tableId });
    }

    if (filter.clientId) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId: filter.clientId });
    }

    if (filter.isActive !== undefined) {
      queryBuilder.andWhere('order.isActive = :isActive', { isActive: filter.isActive });
    }
  }
} 