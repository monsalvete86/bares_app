import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
