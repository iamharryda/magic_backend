import express from 'express';
import { ContactController } from './contact.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public endpoint to submit contact form
router.post('/', ContactController.create);

// Admin-only protected endpoints to view, update & manage contact submissions
router.get('/', verifyToken, adminMiddleware, ContactController.list);
router.get('/:id', verifyToken, adminMiddleware, ContactController.getById);
router.put('/:id', verifyToken, adminMiddleware, ContactController.update);
router.delete('/:id', verifyToken, adminMiddleware, ContactController.remove);

export default router;
