import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { generateReportHtml, ReportTemplateData } from './report-template';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportingService {
  private storageDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.storageDir = path.resolve(process.cwd(), 'storage', 'reports');
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async enqueueReport(householdId: string, templateId = 'standard_v1') {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException(`Household ${householdId} not found`);
    }

    // Create Report row in database with status 'queued'
    const report = await this.prisma.report.create({
      data: {
        householdId,
        templateId,
        status: 'queued',
      },
    });

    // Enqueue async generation
    setImmediate(async () => {
      try {
        await this.prisma.report.update({
          where: { id: report.id },
          data: { status: 'generating' },
        });

        const filePath = await this.renderPdfReport(report.id, householdId);
        const fileUrl = `/reports/${report.id}/download`;

        await this.prisma.report.update({
          where: { id: report.id },
          data: {
            status: 'ready',
            generatedFileUrl: fileUrl,
          },
        });
      } catch (err: any) {
        await this.prisma.report.update({
          where: { id: report.id },
          data: { status: 'failed' },
        });
      }
    });

    return {
      reportId: report.id,
      householdId: report.householdId,
      templateId: report.templateId,
      status: 'queued',
      createdAt: report.createdAt,
    };
  }

  async renderPdfReport(reportId: string, householdId: string): Promise<string> {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        people: true,
        accounts: {
          include: {
            custodian: true,
            holdings: {
              include: { security: true },
            },
          },
        },
      },
    });

    if (!household) throw new NotFoundException('Household not found');

    const latestProfile = await this.prisma.riskProfile.findFirst({
      where: { householdId },
      orderBy: { createdAt: 'desc' },
    });

    let totalNetWorth = 0;
    const accountsData = household.accounts.map((acc) => {
      const balance = acc.holdings.reduce(
        (sum, h) => sum + Number(h.quantity) * Number(h.costBasis),
        0,
      );
      totalNetWorth += balance;
      return {
        id: acc.id,
        accountType: acc.accountType,
        custodian: acc.custodian?.name || 'Custodian',
        balance,
      };
    });

    const holdingsData: any[] = [];
    const classSums: Record<string, number> = { equity: 0, bond: 0, cash: 0, alternative: 0 };

    for (const acc of household.accounts) {
      for (const h of acc.holdings) {
        const val = Number(h.quantity) * Number(h.costBasis);
        const assetClass = (h.security.assetClass || 'equity').toLowerCase();
        if (classSums[assetClass] !== undefined) classSums[assetClass] += val;
        else classSums.equity += val;

        holdingsData.push({
          ticker: h.security.ticker,
          name: h.security.name,
          assetClass,
          quantity: Number(h.quantity),
          costBasis: Number(h.costBasis),
          totalValue: val,
        });
      }
    }

    const divisor = totalNetWorth > 0 ? totalNetWorth : 1;
    const allocation = {
      equity: Number(((classSums.equity / divisor) * 100).toFixed(1)),
      bond: Number(((classSums.bond / divisor) * 100).toFixed(1)),
      cash: Number(((classSums.cash / divisor) * 100).toFixed(1)),
      alternative: Number(((classSums.alternative / divisor) * 100).toFixed(1)),
    };

    const riskVal = (latestProfile?.result as any)?.value;

    const reportData: ReportTemplateData = {
      householdName: household.name,
      members: household.people.map((p) => p.name),
      totalNetWorth,
      accounts: accountsData,
      holdings: holdingsData,
      allocation,
      riskProfile: riskVal ? { score: riskVal.score, category: riskVal.category } : undefined,
      generatedDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }),
      asOfDate: new Date().toISOString().split('T')[0],
    };

    const outPdfPath = path.join(this.storageDir, `report-${reportId}.pdf`);

    // Generate PDF using PDFKit
    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outPdfPath);

      doc.pipe(stream);

      // Header Banner
      doc.fillColor('#0284c7').fontSize(22).font('Helvetica-Bold').text('NEXGILE WEALTHAGENT', 50, 50);
      doc.fillColor('#64748b').fontSize(10).font('Helvetica').text('CONFIDENTIAL CLIENT REPORT', 50, 75);
      doc.text(`As of Date: ${reportData.asOfDate}`, 400, 75, { align: 'right' });
      doc.moveTo(50, 90).lineTo(550, 90).strokeColor('#0284c7').lineWidth(2).stroke();

      // Title
      doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text(reportData.householdName, 50, 110);
      doc.fillColor('#64748b').fontSize(10).font('Helvetica').text(`Members: ${reportData.members.join(', ')}  |  Generated: ${reportData.generatedDate}`, 50, 130);

      // Summary Metric Box
      doc.rect(50, 150, 500, 70).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold').text('TOTAL NET WORTH', 70, 165);
      doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text(`$${reportData.totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 70, 180);

      doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold').text('RISK CATEGORY', 230, 165);
      doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text(reportData.riskProfile?.category?.toUpperCase() || 'MODERATE', 230, 182);

      doc.fillColor('#64748b').fontSize(9).font('Helvetica-Bold').text('EQUITY ALLOCATION', 380, 165);
      doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text(`${reportData.allocation.equity}%`, 380, 182);

      // Accounts Table
      let y = 240;
      doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Household Accounts', 50, y);
      y += 20;
      doc.rect(50, y, 500, 20).fill('#f1f5f9');
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('ACCOUNT TYPE', 60, y + 5);
      doc.text('CUSTODIAN', 250, y + 5);
      doc.text('BALANCE', 450, y + 5, { align: 'right', width: 90 });
      y += 25;

      doc.font('Helvetica').fontSize(9).fillColor('#1e293b');
      for (const acc of reportData.accounts) {
        doc.text(acc.accountType.toUpperCase(), 60, y);
        doc.text(acc.custodian, 250, y);
        doc.text(`$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 450, y, { align: 'right', width: 90 });
        y += 18;
      }

      // Holdings Table
      y += 15;
      doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Top Portfolio Holdings', 50, y);
      y += 20;
      doc.rect(50, y, 500, 20).fill('#f1f5f9');
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('TICKER', 60, y + 5);
      doc.text('SECURITY NAME', 130, y + 5);
      doc.text('CLASS', 330, y + 5);
      doc.text('QTY', 410, y + 5);
      doc.text('MARKET VALUE', 450, y + 5, { align: 'right', width: 90 });
      y += 25;

      doc.font('Helvetica').fontSize(9).fillColor('#1e293b');
      for (const h of reportData.holdings.slice(0, 10)) {
        doc.text(h.ticker, 60, y);
        doc.text(h.name.substring(0, 30), 130, y);
        doc.text(h.assetClass.toUpperCase(), 330, y);
        doc.text(String(h.quantity), 410, y);
        doc.text(`$${h.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 450, y, { align: 'right', width: 90 });
        y += 18;
      }

      // Disclaimer
      doc.fontSize(8).fillColor('#94a3b8').text(
        'Regulatory Disclosure: This statement is for informational and portfolio review purposes. Calculations are derived from custodian book-of-record feeds. Past performance is no guarantee of future returns.',
        50,
        700,
        { width: 500, align: 'center' },
      );

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    return outPdfPath;
  }

  async getReportStatus(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }

    return report;
  }

  getReportFilePath(reportId: string): string {
    const filePath = path.join(this.storageDir, `report-${reportId}.pdf`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Generated report file for ${reportId} not found`);
    }
    return filePath;
  }
}
