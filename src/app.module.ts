import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './repository/auth/auth.module';
import { PrismaService } from './services/prisma';
import { DatabaseGuard } from './config/guards/database.guard';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, DatabaseGuard],
})
export class AppModule {}
