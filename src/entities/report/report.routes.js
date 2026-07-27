import express from 'express';
import { ReportController } from './report.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', ReportController.list);
router.get('/:id', ReportController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, ReportController.create);
router.put('/:id', verifyToken, adminMiddleware, ReportController.update);
router.delete('/:id', verifyToken, adminMiddleware, ReportController.remove);

export default router;
