/** Part 2 owns this application. This stub proves the shared workspace contract. */
import { prisma } from '@nexgile/db';
export async function sharedDatabaseHealth() { return { service: 'advisor-api', database: await prisma.account.count() }; }
