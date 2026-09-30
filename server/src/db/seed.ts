import { prisma } from './prisma.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding Plax ID Database...');

  await prisma.auditLog.deleteMany();
  await prisma.riskSignal.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: {
      name: 'Plax Global Compliance',
      slug: 'plax-global',
    },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'admin@plax.io',
      fullName: 'Mustafa Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const reviewer = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'reviewer@plax.io',
      fullName: 'Sarah Jenkins',
      passwordHash,
      role: 'REVIEWER',
    },
  });

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      organizationId: org.id,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      country: 'US',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      organizationId: org.id,
      email: 'alex.smith@example.com',
      firstName: 'Alex',
      lastName: 'Smith',
      country: 'GB',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      organizationId: org.id,
      email: 'elena.rodriguez@example.com',
      firstName: 'Elena',
      lastName: 'Rodriguez',
      country: 'ES',
    },
  });

  // Create Verifications
  const ver1 = await prisma.verification.create({
    data: {
      organizationId: org.id,
      customerId: customer1.id,
      status: 'APPROVED',
      riskScore: 5.0,
      riskLevel: 'LOW',
      submittedAt: new Date(Date.now() - 3600000 * 2),
      completedAt: new Date(Date.now() - 3600000 * 1.9),
      documents: {
        create: [
          {
            type: 'PASSPORT',
            documentNumber: 'P9823412',
            issueCountry: 'US',
            storageKey: 'docs/passport_johndoe.png',
            ocrVerified: true,
            expiryDate: new Date('2032-05-10'),
          },
        ],
      },
    },
  });

  const ver2 = await prisma.verification.create({
    data: {
      organizationId: org.id,
      customerId: customer2.id,
      status: 'MANUAL_REVIEW',
      riskScore: 35.0,
      riskLevel: 'MEDIUM',
      submittedAt: new Date(Date.now() - 1800000),
      documents: {
        create: [
          {
            type: 'DRIVERS_LICENSE',
            documentNumber: 'DL-8839201',
            issueCountry: 'GB',
            storageKey: 'docs/dl_alexsmith.png',
            ocrVerified: true,
            expiryDate: new Date('2029-11-20'),
          },
        ],
      },
      riskSignals: {
        create: [
          {
            code: 'NAME_MISMATCH',
            severity: 'MEDIUM',
            description: 'Submitted name (Alex) differs slightly from OCR extracted document name (Alexander).',
          },
        ],
      },
    },
  });

  const ver3 = await prisma.verification.create({
    data: {
      organizationId: org.id,
      customerId: customer3.id,
      status: 'REJECTED',
      riskScore: 85.0,
      riskLevel: 'CRITICAL',
      rejectionReason: 'Biometric selfie liveness check failed.',
      submittedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 86300000),
      documents: {
        create: [
          {
            type: 'NATIONAL_ID',
            documentNumber: 'ES-992018',
            issueCountry: 'ES',
            storageKey: 'docs/id_elena.png',
            ocrVerified: true,
          },
        ],
      },
      riskSignals: {
        create: [
          {
            code: 'LIVENESS_FAILED',
            severity: 'CRITICAL',
            description: 'Biometric liveness selfie matching failed.',
          },
        ],
      },
    },
  });

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        actorId: admin.id,
        action: 'SYSTEM_INITIALIZED',
        targetType: 'ORGANIZATION',
        targetId: org.id,
        payload: JSON.stringify({ message: 'Plax ID system seeded' }),
      },
      {
        organizationId: org.id,
        actorId: reviewer.id,
        action: 'VERIFICATION_AUTO_APPROVED',
        targetType: 'VERIFICATION',
        targetId: ver1.id,
        payload: JSON.stringify({ riskScore: 5.0 }),
      },
    ],
  });

  console.log('✅ Seeding complete!');
  console.log('Credentials:');
  console.log('  Admin: admin@plax.io / password123');
  console.log('  Reviewer: reviewer@plax.io / password123');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
