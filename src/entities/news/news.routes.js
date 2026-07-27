import express from 'express';
import { NewsController } from './news.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', NewsController.list);
router.get('/:id', NewsController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, NewsController.create);
router.put('/:id', verifyToken, adminMiddleware, NewsController.update);
router.delete('/:id', verifyToken, adminMiddleware, NewsController.remove);

export default router;
