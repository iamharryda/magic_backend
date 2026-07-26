import express from 'express';
import { SponsorshipController } from './sponsorship.controller.js';
import { verifyToken, userAdminMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

// Step 1: Create hosted Checkout Session for monthly subscription & card saving
router.post('/setup-session', SponsorshipController.setupSession);

// Step 2: Confirm subscription after Checkout redirect
router.post('/confirm-setup', SponsorshipController.confirmSetup);
router.get('/confirm-setup', SponsorshipController.confirmSetup);

// Manual trigger for off-session cron charges (testing/admin)
router.post('/trigger-cron', SponsorshipController.triggerCron);

// Cancel a sponsorship
router.post('/:id/cancel', SponsorshipController.cancel);

// Get current sponsorship status
router.get('/:id/status', SponsorshipController.status);

// List all sponsorships (paginated, Admin only)
router.get('/', verifyToken, userAdminMiddleware, SponsorshipController.list);

export default router;
