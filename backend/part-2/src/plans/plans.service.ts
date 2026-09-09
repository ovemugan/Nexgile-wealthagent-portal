import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlanInfo(planId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
      include: {
        sponsor: true,
      },
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${planId} not found`);
    }

    const participantCount = await this.prisma.participant.count({
      where: { planId },
    });

    return {
      id: plan.id,
      name: plan.name,
      sponsorId: plan.sponsorId,
      sponsorName: plan.sponsor?.name || 'Unknown Sponsor',
      participantCount,
    };
  }

  async getPlanParticipants(planId: string) {
    // TODO: full compliance/fiduciary workflow out of scope for this build
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan ${planId} not found`);
    }

    const participants = await this.prisma.participant.findMany({
      where: { planId },
      include: {
        contributions: true,
      },
    });

    const personIds = participants.map((p) => p.personId);
    const people = await this.prisma.person.findMany({
      where: { id: { in: personIds } },
    });
    const personMap = new Map(people.map((p) => [p.id, p]));

    return participants.map((p) => {
      const person = personMap.get(p.personId);
      const totalContributions = p.contributions.reduce(
        (sum, c) => sum + Number(c.amount),
        0,
      );

      return {
        participantId: p.id,
        planId: p.planId,
        personId: p.personId,
        name: person?.name || 'Participant',
        email: person?.email || '',
        contributionCount: p.contributions.length,
        totalContributions: Number(totalContributions.toFixed(2)),
        contributions: p.contributions.map((c) => ({
          id: c.id,
          amount: Number(c.amount),
          occurredAt: c.occurredAt,
        })),
      };
    });
  }
}
