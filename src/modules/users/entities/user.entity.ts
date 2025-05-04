import { BaseEntity } from '../../../common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'Nombre de usuario único', example: 'john_doe' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Contraseña del usuario (se guarda hasheada)', example: '*****', writeOnly: true })
  @Column()
  password: string;

  @ApiProperty({ description: 'Nombre completo del usuario', example: 'John Doe' })
  @Column()
  fullName: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'john@example.com', required: false, nullable: true })
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ 
    description: 'Rol del usuario', 
    enum: UserRole, 
    enumName: 'UserRole',
    example: UserRole.STAFF,
    default: UserRole.STAFF
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role: UserRole;

  @ApiProperty({ description: 'Indica si el usuario está activo', example: true, default: true })
  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 