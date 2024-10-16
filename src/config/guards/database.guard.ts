import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma';

@Injectable()
export class DatabaseGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = request.headers['cliente_id'];
    global.CLIENTE_ID = String(clientId);

    if (!clientId) {
      throw new UnauthorizedException('CLIENTE NÃO CONFIGURANDO OU NÃO EXISTE');
    }
    await this.prismaService.setConnectionUrl(clientId);
    (request as any).dbConnection = this.prismaService.getPrismaClient();
    return true;
  }
}
