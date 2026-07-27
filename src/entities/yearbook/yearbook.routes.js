import express from 'express';
import { YearbookController } from './yearbook.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', YearbookController.list);
router.get('/:id', YearbookController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, YearbookController.create);
router.put('/:id', verifyToken, adminMiddleware, YearbookController.update);
router.delete('/:id', verifyToken, adminMiddleware, YearbookController.remove);

export default router;
