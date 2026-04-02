import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { registerUser, loginUser } from '../services/auth.service';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const data = await registerUser({ ...result.data, role: result.data.role as Role | undefined });
    res.status(201).json({ message: 'User registered successfully', ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const data = await loginUser(result.data.email, result.data.password);
    res.status(200).json({ message: 'Login successful', ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(401).json({ message });
  }
};
