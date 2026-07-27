import express from 'express';
import { PartnerController } from './partner.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes for applying & viewing partner organizations
router.get('/', PartnerController.list);
router.get('/:id', PartnerController.getById);
router.post('/', PartnerController.create);

// Admin-only management routes
router.put('/:id', verifyToken, adminMiddleware, PartnerController.update);
router.delete('/:id', verifyToken, adminMiddleware, PartnerController.remove);

export default router;
