import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterUserDto {
  @ApiPropertyOptional({ description: 'Filtrar por nombre de usuario', example: 'john' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nombre completo', example: 'John Doe' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Filtrar por correo electrónico', example: 'john@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por rol', 
    enum: UserRole,
    enumName: 'UserRole', 
    example: UserRole.ADMIN 
  })
  @IsOptional()
  @IsEnum(UserRole)
  @Transform(({ value }) => {
    // Asegurarse de que el valor del rol sea válido
    if (value && Object.values(UserRole).includes(value)) {
      return value;
    }
    return undefined;
  })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Filtrar por estado (activo/inactivo)', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
} 