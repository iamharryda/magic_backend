import cron from 'node-cron';
import { SponsorshipService } from '../../entities/sponsorship/sponsorship.service.js';
import logger from '../config/logger.js';

/**
 * Initializes the recurring cron job to charge due subscriptions off-session.
 * Runs daily at midnight (0 0 * * *) by default.
 */
export const initSubscriptionCron = () => {
  const schedulePattern = process.env.CRON_SCHEDULE || '0 0 * * *';

  cron.schedule(schedulePattern, async () => {
    logger.info('[Subscription Cron] Starting check for due monthly subscriptions...');
    try {
      const results = await SponsorshipService.chargeDueSubscriptions();
      logger.info(
        `[Subscription Cron] Finished. Total processed: ${results.total}, Succeeded: ${results.succeeded}, Failed: ${results.failed}`
      );
    } catch (err) {
      logger.error(`[Subscription Cron] Unexpected error during execution: ${err.message}`, err);
    }
  });

  logger.info(`[Subscription Cron] Initialized with schedule: "${schedulePattern}"`);
};
