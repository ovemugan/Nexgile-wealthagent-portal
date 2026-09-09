import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const securityData = [
  ['VTI', 'Vanguard Total Stock Market ETF', 'equity'],
  ['VXUS', 'Vanguard Total International Stock ETF', 'equity'],
  ['BND', 'Vanguard Total Bond Market ETF', 'bond'],
  ['BNDX', 'Vanguard Total International Bond ETF', 'bond'],
  ['VNQ', 'Vanguard Real Estate ETF', 'alternative'],
  ['GLD', 'SPDR Gold Shares', 'alternative'],
  ['SGOV', 'iShares 0-3 Month Treasury Bond ETF', 'cash'],
  ['AAPL', 'Apple Inc.', 'equity'],
  ['MSFT', 'Microsoft Corporation', 'equity'],
  ['GOOGL', 'Alphabet Inc.', 'equity'],
  ['JPM', 'JPMorgan Chase & Co.', 'equity'],
  ['TLT', 'iShares 20+ Year Treasury Bond ETF', 'bond'],
  ['LQD', 'iShares iBoxx $ Investment Grade Corporate Bond', 'bond'],
  ['SCHD', 'Schwab U.S. Dividend Equity ETF', 'equity'],
  ['QQQ', 'Invesco QQQ Trust', 'equity'],
  ['IWM', 'iShares Russell 2000 ETF', 'equity'],
];

async function main() {
  console.log('Seeding Part 2 database...');

  // Clean existing tables in reverse dependency order
  await prisma.approval.deleteMany();
  await prisma.taxOpportunity.deleteMany();
  await prisma.rebalancingProposal.deleteMany();
  await prisma.riskProfile.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.advisorTeamHousehold.deleteMany();
  await prisma.advisorTeam.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.taxLot.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.account.deleteMany();
  await prisma.security.deleteMany();
  await prisma.custodian.deleteMany();
  await prisma.roleAssignment.deleteMany();
  await prisma.person.deleteMany();
  await prisma.household.deleteMany();

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);
  const now = new Date();

  // Custodians
  const custodians = await Promise.all([
    prisma.custodian.create({ data: { name: 'Fidelity Investments (Mock)' } }),
    prisma.custodian.create({ data: { name: 'Charles Schwab (Mock)' } }),
    prisma.custodian.create({ data: { name: 'Vanguard Group (Mock)' } }),
  ]);

  // Securities
  const securities = await Promise.all(
    securityData.map(([ticker, name, assetClass]) =>
      prisma.security.create({ data: { ticker, name, assetClass } }),
    ),
  );

  // Advisor Person
  const advisor = await prisma.person.create({
    data: {
      email: 'advisor@nexgile.demo',
      name: 'Avery Advisor',
      passwordHash,
    },
  });

  // Advisor Team
  const advisorTeam = await prisma.advisorTeam.create({
    data: {
      name: 'Premier Wealth Advisory Team',
    },
  });

  // Assign Advisor to AdvisorTeam
  await prisma.roleAssignment.create({
    data: {
      personId: advisor.id,
      role: 'advisor',
      scopeType: 'AdvisorTeam',
      scopeId: advisorTeam.id,
    },
  });

  // Seed 3 Households
  const householdNames = ['Montgomery Household', 'Vanderbilt Household', 'Kensington Household'];
  const householdIds: string[] = [];
  const accountIds: string[] = [];
  let washSaleDetails: any = null;

  for (let i = 0; i < householdNames.length; i++) {
    const household = await prisma.household.create({
      data: { name: householdNames[i] },
    });
    householdIds.push(household.id);

    // Link Household to AdvisorTeam
    await prisma.advisorTeamHousehold.create({
      data: {
        advisorTeamId: advisorTeam.id,
        householdId: household.id,
      },
    });

    // Owner Person
    const owner = await prisma.person.create({
      data: {
        householdId: household.id,
        email: `owner${i + 1}@nexgile.demo`,
        name: `${householdNames[i].split(' ')[0]} Primary`,
        passwordHash,
      },
    });

    await prisma.roleAssignment.create({
      data: {
        personId: owner.id,
        role: 'owner',
        scopeType: 'Household',
        scopeId: household.id,
      },
    });

    // Accounts for this household
    const accountTypes = ['taxable', 'traditional_ira', 'roth_ira'];
    for (let a = 0; a < 2; a++) {
      const account = await prisma.account.create({
        data: {
          householdId: household.id,
          custodianId: custodians[(i + a) % custodians.length].id,
          accountType: accountTypes[a],
          lastSyncedAt: now,
        },
      });
      accountIds.push(account.id);

      // Holdings
      for (let s = 0; s < 4; s++) {
        const sec = securities[(i * 3 + a * 2 + s) % securities.length];
        const qty = 50 + s * 25;
        const currentPrice = 100 + s * 30;

        const holding = await prisma.holding.create({
          data: {
            accountId: account.id,
            securityId: sec.id,
            quantity: qty,
            costBasis: currentPrice,
            asOf: now,
            source: 'mock_custodian',
          },
        });

        // Tax Lots: one lot with loss for tax-loss harvesting demo
        const isLossLot = (i === 0 && a === 0 && s === 0);
        const lotCostBasis = isLossLot ? currentPrice + 40 : currentPrice - 15;

        await prisma.taxLot.create({
          data: {
            holdingId: holding.id,
            quantity: qty,
            costBasis: lotCostBasis,
            acquiredAt: new Date(now.getTime() - (60 + s * 30) * 24 * 60 * 60 * 1000),
          },
        });
      }

      // Seed Wash-Sale Scenario in First Account:
      // Sold security at loss 14 days ago, rebought within 30 days (4 days ago)
      if (i === 0 && a === 0) {
        const washSec = securities[0]; // VTI
        const saleTx = await prisma.transaction.create({
          data: {
            accountId: account.id,
            type: 'sell',
            securityId: washSec.id,
            amount: 5000,
            quantity: 25,
            occurredAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          },
        });

        const rebuyTx = await prisma.transaction.create({
          data: {
            accountId: account.id,
            type: 'buy',
            securityId: washSec.id,
            amount: 5200,
            quantity: 25,
            occurredAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          },
        });

        washSaleDetails = {
          accountId: account.id,
          securityId: washSec.id,
          ticker: washSec.ticker,
          saleTxId: saleTx.id,
          rebuyTxId: rebuyTx.id,
          saleDate: saleTx.occurredAt,
          rebuyDate: rebuyTx.occurredAt,
        };
      }

      // Add general transactions
      for (let t = 0; t < 10; t++) {
        const sec = securities[t % securities.length];
        await prisma.transaction.create({
          data: {
            accountId: account.id,
            type: t % 4 === 0 ? 'dividend' : t % 3 === 0 ? 'sell' : 'buy',
            securityId: sec.id,
            amount: 250 + t * 50,
            quantity: 5 + t,
            occurredAt: new Date(now.getTime() - (t * 15 + 1) * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    // Goal & Scenario for simulation
    const goal = await prisma.goal.create({
      data: {
        householdId: household.id,
        name: 'Retirement Horizon 2045',
        type: 'retirement',
        targetAmount: 1500000,
        targetDate: new Date(now.getFullYear() + 20, 0, 1),
      },
    });

    await prisma.scenario.create({
      data: {
        goalId: goal.id,
        assumptions: {
          rateOfReturn: 0.07,
          stdDev: 0.15,
          contributionAmount: 15000,
          inflation: 0.025,
        },
        result: {
          method: 'compound_growth_deterministic',
          value: { projectedBalance: 1420000 },
        },
      },
    });

    // Risk Profile for Household 1
    if (i === 0) {
      await prisma.riskProfile.create({
        data: {
          householdId: household.id,
          answers: { timeHorizon: 4, lossTolerance: 4, incomeStability: 5, liquidityNeeds: 2, investmentKnowledge: 4, marketDropReaction: 4, riskVsReturn: 4, emergencyFund: 5 },
          result: {
            value: {
              score: 75,
              category: 'aggressive',
              targetAllocation: { equity: 80, bond: 10, cash: 5, alternative: 5 },
            },
            asOf: now.toISOString().split('T')[0],
            method: 'weighted_questionnaire_v1',
            assumptions: { minScore: 0, maxScore: 100 },
            limitations: ['Self-reported bias'],
            computedAt: now.toISOString(),
          },
        },
      });
    }
  }

  // Seed Institutional Retirement Plan Stubs
  const sponsor = await prisma.sponsor.create({
    data: {
      name: 'Acme Technologies 401(k) Plan Sponsor',
    },
  });

  const plan = await prisma.plan.create({
    data: {
      name: 'Acme Safe Harbor 401(k) Plan',
      sponsorId: sponsor.id,
    },
  });

  const participantPerson = await prisma.person.create({
    data: {
      email: 'participant@nexgile.demo',
      name: 'Jordan Participant',
      passwordHash,
    },
  });

  const participant = await prisma.participant.create({
    data: {
      planId: plan.id,
      personId: participantPerson.id,
    },
  });

  await prisma.contribution.create({
    data: {
      participantId: participant.id,
      amount: 1250.0,
      occurredAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.contribution.create({
    data: {
      participantId: participant.id,
      amount: 1250.0,
      occurredAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
    },
  });

  const seedSummary = {
    demoCredentials: {
      advisor: 'advisor@nexgile.demo / DemoPassword123!',
      owners: 'owner1@nexgile.demo through owner3@nexgile.demo / DemoPassword123!',
      participant: 'participant@nexgile.demo / DemoPassword123!',
    },
    advisorTeamId: advisorTeam.id,
    advisorId: advisor.id,
    households: householdIds,
    accounts: accountIds,
    planId: plan.id,
    sponsorId: sponsor.id,
    washSaleScenario: washSaleDetails,
  };

  const outputPath = path.join(__dirname, '..', 'seed-output.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedSummary, null, 2));

  console.log('Part 2 seed finished successfully!');
  console.log('Seed summary saved to seed-output.json:');
  console.log(JSON.stringify(seedSummary, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
