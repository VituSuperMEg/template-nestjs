import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configuracoes } from 'src/config/clientes';
import { PrismaService } from 'src/services/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    const prisma = this.prismaService.getPrismaClient();

    const user = await prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Este Usuário Não Existe');
    }
    const cliente = configuracoes.database[global.CLIENTE_ID];
    global.SESSION = {
      id: user.id,
    };
    const payload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      ativo: user.ativo,
      username: user.login,
      cliente_id: global.CLIENTE_ID,
      cliente: {
        database: cliente.database,
      },
    };
    return {
      session: await this.jwtService.signAsync(payload),
    };
  }
}
