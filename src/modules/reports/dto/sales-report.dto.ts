import { ApiProperty } from '@nestjs/swagger';

export class SalesReportDto {
  @ApiProperty({
    description: 'Ventas totales en el período',
    example: 1500.25
  })
  totalSales: number;

  @ApiProperty({
    description: 'Número total de pedidos en el período',
    example: 50
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Valor promedio de los pedidos',
    example: 30.50
  })
  averageOrderValue: number;
}

export class SalesDetailDto {
  @ApiProperty({
    description: 'Fecha del reporte',
    example: '2023-05-10'
  })
  date: string;

  @ApiProperty({
    description: 'Ventas totales para esa fecha',
    example: 240.50
  })
  total: number;

  @ApiProperty({
    description: 'Número de pedidos para esa fecha',
    example: 8
  })
  ordersCount: number;
}

export class TopProductDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  productId: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Hamburguesa Especial'
  })
  productName: string;

  @ApiProperty({
    description: 'Cantidad total vendida',
    example: 25
  })
  quantity: number;

  @ApiProperty({
    description: 'Total de ventas generadas por este producto',
    example: 250.00
  })
  totalSales: number;
} 