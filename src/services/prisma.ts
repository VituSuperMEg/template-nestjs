import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { configuracoes } from 'src/config/clientes';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = this;
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async setConnectionUrl(clientId: string) {
    // Buscar as configurações dos usuários dentro do banco de dados
    const cliente = configuracoes.database[+clientId];

    // Montaq a url de conexão
    const url = `postgresql://${cliente.username}:${cliente.password}@${cliente.host}:${cliente.port}/${cliente.database}?schema=public`;

    await this.prisma.$disconnect();

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url,
        },
      },
    });

    await this.prisma.$connect();
  }

  getPrismaClient() {
    return this.prisma;
  }
}
