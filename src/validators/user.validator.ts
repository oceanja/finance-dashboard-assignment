import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});
