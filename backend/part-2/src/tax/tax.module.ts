import { Module } from '@nestjs/common';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [TaxController],
  providers: [TaxService, PrismaService, AuditService],
  exports: [TaxService],
})
export class TaxModule {}
