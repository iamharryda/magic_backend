import express from 'express';
import { EventController } from './event.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', EventController.list);
router.get('/:id', EventController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, EventController.create);
router.put('/:id', verifyToken, adminMiddleware, EventController.update);
router.delete('/:id', verifyToken, adminMiddleware, EventController.remove);

export default router;
