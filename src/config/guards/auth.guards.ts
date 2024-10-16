import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma';
import { Request } from 'express';
import { jwtConstants } from 'src/constants/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido!');
    }

    // Extracao id
    const cliente_id = request.headers['cliente_id'];
    const cliente = String(cliente_id);

    if (!cliente) {
      throw new UnauthorizedException('Cliente não informado');
    }

    try {
      await this.prismaService.setConnectionUrl(cliente);
      (request as any).dbConnection = this.prismaService.getPrismaClient();
    } catch (error) {
      console.error(
        `Erro de conexão ao banco de dados para o cliente ${cliente}:`,
        error,
      );
      throw new UnauthorizedException(
        `Erro de conexão ao banco de dados para o cliente ${cliente}`,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
