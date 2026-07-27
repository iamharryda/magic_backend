import express from 'express';
import { BlogController } from './blog.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', BlogController.list);
router.get('/:id', BlogController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, BlogController.create);
router.put('/:id', verifyToken, adminMiddleware, BlogController.update);
router.delete('/:id', verifyToken, adminMiddleware, BlogController.remove);

export default router;
