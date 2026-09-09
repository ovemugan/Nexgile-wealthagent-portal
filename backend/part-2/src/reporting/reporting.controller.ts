import { Controller, Post, Get, Param, Body, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Response } from 'express';

export class GenerateReportDto {
  templateId?: string;
}

@ApiTags('Branded PDF Reporting')
@Controller()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post('households/:id/reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enqueue async PDF report generation for a household' })
  @ApiResponse({ status: 202, description: 'Report job enqueued, returns status and reportId' })
  async generateReport(
    @Param('id') householdId: string,
    @Body() body?: GenerateReportDto,
  ) {
    return this.reportingService.enqueueReport(householdId, body?.templateId);
  }

  @Get('reports/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Poll report generation status and get file download URL' })
  @ApiResponse({ status: 200, description: 'Report object with status and generatedFileUrl' })
  async getReport(@Param('id') reportId: string) {
    return this.reportingService.getReportStatus(reportId);
  }

  @Get('reports/:id/download')
  @ApiOperation({ summary: 'Download the generated PDF file' })
  @ApiResponse({ status: 200, description: 'Binary PDF file' })
  async downloadReport(@Param('id') reportId: string, @Res() res: Response) {
    const filePath = this.reportingService.getReportFilePath(reportId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=wealth-report-${reportId}.pdf`);
    res.sendFile(filePath);
  }
}
