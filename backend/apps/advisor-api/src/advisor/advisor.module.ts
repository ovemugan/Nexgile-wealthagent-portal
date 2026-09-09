import { Module } from '@nestjs/common';
import { AdvisorController } from './advisor.controller';
import { AdvisorService } from './advisor.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AdvisorController],
  providers: [AdvisorService, PrismaService],
  exports: [AdvisorService],
})
export class AdvisorModule {}
