import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('general_config')
export class GeneralConfig extends BaseEntity {
  @ApiProperty({ 
    description: 'Nombre de la entidad o negocio', 
    example: 'Bar El Rincón' 
  })
  @Column({ name: 'nombre_entidad' })
  nombreEntidad: string;

  @ApiProperty({ 
    description: 'Nombre del propietario del negocio', 
    example: 'Juan Pérez' 
  })
  @Column()
  propietario: string;

  @ApiProperty({ 
    description: 'Número de identificación fiscal o comercial', 
    example: 'B12345678' 
  })
  @Column({ name: 'numero_id' })
  numeroId: string;

  @ApiProperty({ 
    description: 'Dirección física del negocio', 
    example: 'Calle Principal 123, Ciudad' 
  })
  @Column()
  direccion: string;

  @ApiProperty({ 
    description: 'Número de teléfono de contacto', 
    example: '+34 912345678' 
  })
  @Column()
  telefono: string;

  @ApiProperty({ 
    description: 'Correo electrónico de contacto', 
    example: 'contacto@barrincon.com' 
  })
  @Column()
  correo: string;

  @ApiPropertyOptional({ 
    description: 'Redes sociales del negocio', 
    example: {
      facebook: 'facebook.com/elrincon',
      instagram: '@elrincon',
      twitter: '@bar_elrincon'
    } 
  })
  @Column({ name: 'redes_sociales', type: 'json', nullable: true })
  redesSociales: Record<string, string>;

  @ApiProperty({ 
    description: 'Número de inicio para la secuencia de facturas', 
    example: 1000,
    default: 1 
  })
  @Column({ name: 'numero_inicio_facturas', default: 1 })
  numeroInicioFacturas: number;

  @ApiPropertyOptional({ 
    description: 'Texto a incluir en el encabezado de las facturas', 
    example: 'Gracias por su visita a Bar El Rincón' 
  })
  @Column({ name: 'texto_facturas', type: 'text', nullable: true })
  textoFacturas: string;

  @ApiPropertyOptional({ 
    description: 'Texto a incluir al pie de las facturas', 
    example: 'IVA incluido. Conserve esta factura para posibles reclamaciones.' 
  })
  @Column({ name: 'pie_facturas', type: 'text', nullable: true })
  pieFacturas: string;
} 