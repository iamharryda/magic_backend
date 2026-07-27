import express from 'express';
import { AwardController } from './award.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', AwardController.list);
router.get('/:id', AwardController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, AwardController.create);
router.put('/:id', verifyToken, adminMiddleware, AwardController.update);
router.delete('/:id', verifyToken, adminMiddleware, AwardController.remove);

export default router;
