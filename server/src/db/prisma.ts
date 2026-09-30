import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function getDefaultOrganizationId(providedOrgId?: string): Promise<string> {
  if (providedOrgId) return providedOrgId;

  const existingOrg = await prisma.organization.findFirst();
  if (existingOrg) return existingOrg.id;

  const newOrg = await prisma.organization.create({
    data: {
      name: 'Plax Global Compliance',
      slug: 'plax-global',
    },
  });
  return newOrg.id;
}
