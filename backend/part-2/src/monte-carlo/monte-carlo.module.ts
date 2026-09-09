import { Module } from '@nestjs/common';
import { MonteCarloController } from './monte-carlo.controller';
import { MonteCarloService } from './monte-carlo.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [MonteCarloController],
  providers: [MonteCarloService, PrismaService],
  exports: [MonteCarloService],
})
export class MonteCarloModule {}
