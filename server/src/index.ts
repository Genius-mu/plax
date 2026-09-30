import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerController, loginController, meController } from './controllers/authController.js';
import {
  createVerificationController,
  listVerificationsController,
  getVerificationByIdController,
  makeDecisionController,
} from './controllers/verificationController.js';
import { getDashboardStatsController } from './controllers/dashboardController.js';
import { getAuditLogsController } from './controllers/auditController.js';
import { authenticate, requireRole } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Plax ID Verification Engine REST API v2.0', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/register', registerController);
app.post('/api/auth/login', loginController);
app.get('/api/auth/me', authenticate, meController);

// Verification Workflow Routes
app.post('/api/verifications', createVerificationController); // Anyone/Customer can submit verification
app.get('/api/verifications', authenticate, listVerificationsController);
app.get('/api/verifications/:id', authenticate, getVerificationByIdController);
app.patch('/api/verifications/:id/decision', authenticate, requireRole(['ADMIN', 'REVIEWER']), makeDecisionController);

// Compliance Dashboard Analytics
app.get('/api/dashboard/stats', authenticate, requireRole(['ADMIN', 'REVIEWER']), getDashboardStatsController);

// Audit Logs & Compliance Trail
app.get('/api/audit-logs', authenticate, requireRole(['ADMIN']), getAuditLogsController);

app.listen(PORT, () => {
  console.log(`🚀 Plax ID REST API & Verification Engine running on http://localhost:${PORT}`);
});
