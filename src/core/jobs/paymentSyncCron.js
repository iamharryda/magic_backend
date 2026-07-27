import cron from 'node-cron';
import { DonationService } from '../../entities/donation/donation.service.js';
import { SponsorshipService } from '../../entities/sponsorship/sponsorship.service.js';
import logger from '../config/logger.js';

/**
 * Initializes the recurring cron job to sync pending donations and incomplete sponsorships.
 * Runs every 5 seconds ( * / 5 * * * * * ) by default.
 */
export const initPaymentSyncCron = () => {
  const schedulePattern = process.env.PAYMENT_SYNC_CRON_SCHEDULE || '*/5 * * * * *';

  cron.schedule(schedulePattern, async () => {
    try {
      const donationResults = await DonationService.syncPendingDonations();
      const sponsorshipResults = await SponsorshipService.syncIncompleteSponsorships();
      
      // Only log if something was actually found or processed to avoid log spam every 5 seconds
      if (donationResults.total > 0 || sponsorshipResults.total > 0) {
        logger.info(
          `[Payment Sync Cron] Donations -> Total pending: ${donationResults.total}, Processed: ${donationResults.processed}, Completed: ${donationResults.completed}, Expired: ${donationResults.expired}`
        );
        logger.info(
          `[Payment Sync Cron] Sponsorships -> Total incomplete: ${sponsorshipResults.total}, Processed: ${sponsorshipResults.processed}, Completed: ${sponsorshipResults.completed}, Expired: ${sponsorshipResults.expired}`
        );
      }
    } catch (err) {
      logger.error(`[Payment Sync Cron] Unexpected error during execution: ${err.message}`, err);
    }
  });

  logger.info(`[Payment Sync Cron] Initialized with schedule: "${schedulePattern}"`);
};
