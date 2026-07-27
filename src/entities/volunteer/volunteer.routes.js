import express from 'express';
import { VolunteerController } from './volunteer.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes for applying & viewing volunteer organizations/working volunteers
router.get('/', VolunteerController.list);
router.get('/:id', VolunteerController.getById);
router.post('/', VolunteerController.create);

// Admin-only management routes
router.put('/:id', verifyToken, adminMiddleware, VolunteerController.update);
router.delete('/:id', verifyToken, adminMiddleware, VolunteerController.remove);

export default router;
