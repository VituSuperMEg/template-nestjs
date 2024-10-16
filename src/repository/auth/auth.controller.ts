import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { DatabaseGuard } from 'src/config/guards/database.guard';
import { AuthService } from './auth.service';

@Controller('login')
@UseGuards(DatabaseGuard)
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async login(@Body() data: any): Promise<string> {
    const { login, pass } = data;
    return this.service.signIn(login, pass);
  }
}
