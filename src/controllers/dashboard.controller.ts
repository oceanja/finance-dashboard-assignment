import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as dashboardService from '../services/dashboard.service';

export const getSummary = async (_req: AuthRequest, res: Response): Promise<void> => {
  const data = await dashboardService.getSummary();
  res.json(data);
};

export const getCategoryBreakdown = async (_req: AuthRequest, res: Response): Promise<void> => {
  const data = await dashboardService.getCategoryBreakdown();
  res.json(data);
};

export const getMonthlyTrends = async (_req: AuthRequest, res: Response): Promise<void> => {
  const data = await dashboardService.getMonthlyTrends();
  res.json(data);
};

export const getRecentActivity = async (_req: AuthRequest, res: Response): Promise<void> => {
  const data = await dashboardService.getRecentActivity();
  res.json(data);
};
