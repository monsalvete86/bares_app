import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReportsService } from '../services/reports.service';
import { SalesFilterDto } from '../dto/sales-filter.dto';
import { SalesReportDto, SalesDetailDto, TopProductDto } from '../dto/sales-report.dto';

@ApiTags('Reportes')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales/summary')
  @ApiResponse({
    status: 200,
    description: 'Resumen de ventas obtenido correctamente',
    type: SalesReportDto,
  })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'ID de la mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'ID del cliente' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Estado activo de las órdenes' })
  async getSalesSummary(
    @Query() filter: SalesFilterDto,
  ): Promise<SalesReportDto> {
    return this.reportsService.getSalesSummary(filter);
  }

  @Get('sales/timeline')
  @ApiResponse({
    status: 200,
    description: 'Timeline de ventas obtenido correctamente',
    type: [SalesDetailDto],
  })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'ID de la mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'ID del cliente' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Estado activo de las órdenes' })
  async getSalesTimeline(
    @Query() filter: SalesFilterDto,
  ): Promise<SalesDetailDto[]> {
    return this.reportsService.getSalesTimeline(filter);
  }

  @Get('products/top')
  @ApiResponse({
    status: 200,
    description: 'Top productos obtenidos correctamente',
    type: [TopProductDto],
  })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'ID de la mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'ID del cliente' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Estado activo de las órdenes' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de productos a mostrar' })
  async getTopProducts(
    @Query() filter: SalesFilterDto,
    @Query('limit') limit?: number,
  ): Promise<TopProductDto[]> {
    return this.reportsService.getTopProducts(filter, limit ? parseInt(limit as any, 10) : 10);
  }

  @Get('orders/export')
  @ApiResponse({
    status: 200,
    description: 'Datos para exportación obtenidos correctamente',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'tableId', required: false, type: String, description: 'ID de la mesa' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'ID del cliente' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Estado activo de las órdenes' })
  async exportOrders(
    @Query() filter: SalesFilterDto,
  ): Promise<any> {
    // Esta función retornará los datos para exportación
    // Para simplificar, utilizaremos los mismos datos del timeline
    return this.reportsService.getSalesTimeline(filter);
  }
} 