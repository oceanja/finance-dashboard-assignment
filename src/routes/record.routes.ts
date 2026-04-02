import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as recordController from '../controllers/record.controller';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.use((req, res, next) => authenticate(req as AuthRequest, res, next));

// VIEWER, ANALYST, ADMIN can read
router.get('/', authorize('VIEWER', 'ANALYST', 'ADMIN'), (req, res) =>
  recordController.getRecords(req as AuthRequest, res)
);
router.get('/:id', authorize('VIEWER', 'ANALYST', 'ADMIN'), (req, res) =>
  recordController.getRecordById(req as AuthRequest, res)
);

// Only ADMIN can create, update, delete
router.post('/', authorize('ADMIN'), (req, res) =>
  recordController.createRecord(req as AuthRequest, res)
);
router.patch('/:id', authorize('ADMIN'), (req, res) =>
  recordController.updateRecord(req as AuthRequest, res)
);
router.delete('/:id', authorize('ADMIN'), (req, res) =>
  recordController.deleteRecord(req as AuthRequest, res)
);

export default router;
