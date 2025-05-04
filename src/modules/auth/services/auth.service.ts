import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByUsername(username);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
      }
      
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      return user;
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
} 