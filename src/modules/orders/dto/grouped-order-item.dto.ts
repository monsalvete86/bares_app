import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/products/entities/product.entity';

export class GroupedOrderItemDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  productId: string;

  @ApiProperty({
    description: 'Información completa del producto',
    type: () => Product
  })
  product: Product;

  @ApiProperty({
    description: 'Cantidad total del producto',
    example: 5
  })
  totalQuantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 10.99
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Subtotal (precio × cantidad)',
    example: 54.95
  })
  subtotal: number;

  @ApiProperty({
    description: 'IDs de los items originales agrupados',
    example: ['123e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174006']
  })
  itemIds: string[];
} 