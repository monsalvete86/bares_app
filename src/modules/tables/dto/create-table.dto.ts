import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ description: 'Número de la mesa', example: 1, minimum: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  number: number;

  @ApiProperty({ description: 'Nombre de la mesa', example: 'Mesa VIP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción de la mesa', example: 'Mesa para eventos especiales', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Indica si la mesa está ocupada', 
    example: false, 
    required: false, 
    default: false 
  })
  @IsOptional()
  isOccupied?: boolean;

  @ApiProperty({ 
    description: 'Indica si la mesa está activa', 
    example: true, 
    required: false, 
    default: true 
  })
  @IsOptional()
  isActive?: boolean;
} 