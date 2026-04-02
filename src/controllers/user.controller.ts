import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { updateUserSchema } from '../validators/user.validator';
import * as userService from '../services/user.service';
import { Role } from '@prisma/client';

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.user!.userId);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get user';
    res.status(404).json({ message });
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params['id'] as string);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get user';
    res.status(404).json({ message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await userService.updateUser(req.params['id'] as string, {
      ...result.data,
      role: result.data.role as Role | undefined,
    });
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    res.status(400).json({ message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await userService.deleteUser(req.params['id'] as string, req.user!.userId);
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete user';
    res.status(400).json({ message });
  }
};
