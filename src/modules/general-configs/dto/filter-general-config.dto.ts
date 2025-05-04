import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterGeneralConfigDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por nombre de la entidad o negocio', 
    example: 'Bar' 
  })
  @IsOptional()
  @IsString()
  nombreEntidad?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por nombre del propietario', 
    example: 'Juan' 
  })
  @IsOptional()
  @IsString()
  propietario?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por número de identificación', 
    example: 'B12345' 
  })
  @IsOptional()
  @IsString()
  numeroId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por dirección', 
    example: 'Calle Principal' 
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por teléfono', 
    example: '912345' 
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por correo electrónico', 
    example: 'contacto@' 
  })
  @IsOptional()
  @IsString()
  correo?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por número de inicio de facturas', 
    example: 1000 
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  numeroInicioFacturas?: number;
} 