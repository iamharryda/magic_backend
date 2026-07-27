import express from 'express';
import { ProjectController } from './project.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.getById);

// Admin-only protected routes
router.post('/', verifyToken, adminMiddleware, ProjectController.create);
router.put('/:id', verifyToken, adminMiddleware, ProjectController.update);
router.delete('/:id', verifyToken, adminMiddleware, ProjectController.remove);

export default router;
