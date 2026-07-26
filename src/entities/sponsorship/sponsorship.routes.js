import express from 'express';
import { SponsorshipController } from './sponsorship.controller.js';

const router = express.Router();

// Step 1: create customer + SetupIntent (frontend confirms the card)
router.post('/setup', SponsorshipController.setup);

// Step 2: create the recurring off-session subscription
router.post('/subscribe', SponsorshipController.subscribe);

// Cancel a sponsorship
router.post('/:id/cancel', SponsorshipController.cancel);

// Pull current subscription status from Stripe (no webhooks)
router.get('/:id/status', SponsorshipController.status);

export default router;
