import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response, NextFunction } from 'express';

const router = Router();

// All user routes require authentication
router.use((req, res, next) => authenticate(req as AuthRequest, res, next));

// Any authenticated user can view their own profile
router.get('/me', (req, res) => userController.getMe(req as AuthRequest, res));

// Admin-only routes
router.get('/', authorize('ADMIN'), (req, res) => userController.getAllUsers(req as AuthRequest, res));
router.get('/:id', authorize('ADMIN'), (req, res) => userController.getUserById(req as AuthRequest, res));
router.patch('/:id', authorize('ADMIN'), (req, res) => userController.updateUser(req as AuthRequest, res));
router.delete('/:id', authorize('ADMIN'), (req, res) => userController.deleteUser(req as AuthRequest, res));

export default router;
