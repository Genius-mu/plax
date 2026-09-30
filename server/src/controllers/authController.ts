import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { AuthService } from '../services/authService.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['ADMIN', 'REVIEWER', 'CUSTOMER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function registerController(req: AuthenticatedRequest, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    res.status(201).json({ data: result });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(400).json({ error: { code: 'REGISTRATION_FAILED', message: err.message } });
  }
}

export async function loginController(req: AuthenticatedRequest, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password);
    res.json({ data: result });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email address or password.' } });
  }
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  res.json({ data: { user: req.user } });
}
