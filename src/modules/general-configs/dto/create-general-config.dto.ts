import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject, IsEmail, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGeneralConfigDto {
  @ApiProperty({ 
    description: 'Nombre de la entidad o negocio', 
    example: 'Bar El Rincón' 
  })
  @IsString()
  @IsNotEmpty()
  nombreEntidad: string;

  @ApiProperty({ 
    description: 'Nombre del propietario del negocio', 
    example: 'Juan Pérez' 
  })
  @IsString()
  @IsNotEmpty()
  propietario: string;

  @ApiProperty({ 
    description: 'Número de identificación fiscal o comercial', 
    example: 'B12345678' 
  })
  @IsString()
  @IsNotEmpty()
  numeroId: string;

  @ApiProperty({ 
    description: 'Dirección física del negocio', 
    example: 'Calle Principal 123, Ciudad' 
  })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ 
    description: 'Número de teléfono de contacto', 
    example: '+34 912345678' 
  })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ 
    description: 'Correo electrónico de contacto', 
    example: 'contacto@barrincon.com' 
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiPropertyOptional({ 
    description: 'Redes sociales del negocio', 
    example: {
      facebook: 'facebook.com/elrincon',
      instagram: '@elrincon',
      twitter: '@bar_elrincon'
    }
  })
  @IsOptional()
  @IsObject()
  redesSociales?: Record<string, string>;

  @ApiPropertyOptional({ 
    description: 'Número de inicio para la secuencia de facturas', 
    example: 1000,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numeroInicioFacturas?: number;

  @ApiPropertyOptional({ 
    description: 'Texto a incluir en el encabezado de las facturas', 
    example: 'Gracias por su visita a Bar El Rincón' 
  })
  @IsOptional()
  @IsString()
  textoFacturas?: string;

  @ApiPropertyOptional({ 
    description: 'Texto a incluir al pie de las facturas', 
    example: 'IVA incluido. Conserve esta factura para posibles reclamaciones.' 
  })
  @IsOptional()
  @IsString()
  pieFacturas?: string;
} 