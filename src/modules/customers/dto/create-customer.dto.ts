import { IsNotEmpty, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID de la mesa asociada al cliente', example: 'uuid-de-la-mesa' })
  @IsUUID()
  @IsNotEmpty()
  tableId: string;

  @ApiPropertyOptional({ description: 'Indica si el cliente está activo', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 