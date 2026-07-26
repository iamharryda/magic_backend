import express from 'express';
import { DonationController } from './donation.controller.js';

const router = express.Router();

// Create a one-time Checkout Session; returns the hosted Checkout URL
router.post('/checkout', DonationController.createCheckout);

// Confirm payment after Checkout redirect (frontend passes ?session_id=...)
router.get('/confirm', DonationController.confirm);

export default router;
