import express from 'express';
import { CareerController } from './career.controller.js';
import { verifyToken, adminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes for job seekers
router.get('/', CareerController.list);
router.post('/apply', CareerController.apply);
router.post('/:id/apply', CareerController.apply);

// Admin-only candidate applications endpoints (must be before /:id)
router.get('/applications', verifyToken, adminMiddleware, CareerController.listApplications);
router.get('/applications/:id', verifyToken, adminMiddleware, CareerController.getApplicationById);
router.put('/applications/:id', verifyToken, adminMiddleware, CareerController.updateApplication);
router.delete('/applications/:id', verifyToken, adminMiddleware, CareerController.removeApplication);

// Public single career route
router.get('/:id', CareerController.getById);

// Admin-only career management routes
router.post('/', verifyToken, adminMiddleware, CareerController.create);
router.put('/:id', verifyToken, adminMiddleware, CareerController.update);
router.delete('/:id', verifyToken, adminMiddleware, CareerController.remove);

export default router;
