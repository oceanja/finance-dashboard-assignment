import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as dashboardController from '../controllers/dashboard.controller';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.use((req, res, next) => authenticate(req as AuthRequest, res, next));

// ANALYST and ADMIN can access dashboard
router.get('/summary', authorize('ANALYST', 'ADMIN'), (req, res) =>
  dashboardController.getSummary(req as AuthRequest, res)
);
router.get('/categories', authorize('ANALYST', 'ADMIN'), (req, res) =>
  dashboardController.getCategoryBreakdown(req as AuthRequest, res)
);
router.get('/trends', authorize('ANALYST', 'ADMIN'), (req, res) =>
  dashboardController.getMonthlyTrends(req as AuthRequest, res)
);
router.get('/recent', authorize('ANALYST', 'ADMIN'), (req, res) =>
  dashboardController.getRecentActivity(req as AuthRequest, res)
);

export default router;
