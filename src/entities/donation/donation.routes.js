import express from 'express';
import { DonationController } from './donation.controller.js';
import { verifyToken, userAdminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Create a one-time Checkout Session; returns the hosted Checkout URL
router.post('/checkout', DonationController.createCheckout);

// Confirm payment after Checkout redirect (frontend passes ?session_id=...)
router.get('/confirm', DonationController.confirm);

// List all donations (paginated, Admin only)
router.get('/', verifyToken, userAdminMiddleware, DonationController.list);

export default router;
