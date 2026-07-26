import { SponsorshipService } from './sponsorship.service.js';

export const SponsorshipController = {
  // POST /api/v1/sponsorship/setup-session
  async setupSession(req, res, next) {
    try {
      const { sponsorName, sponsorEmail, childId, amount, interval } = req.body;
      const result = await SponsorshipService.createSetupCheckoutSession({
        sponsorName,
        sponsorEmail,
        childId,
        amount,
        interval,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/sponsorship/confirm-setup
  async confirmSetup(req, res, next) {
    try {
      const sessionId = req.query.session_id || req.body.sessionId;
      const result = await SponsorshipService.confirmSetup(sessionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/sponsorship/trigger-cron (Admin / manual test route)
  async triggerCron(req, res, next) {
    try {
      const result = await SponsorshipService.chargeDueSubscriptions();
      res.json({ message: 'Cron job executed', ...result });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/sponsorship/:id/cancel
  async cancel(req, res, next) {
    try {
      const result = await SponsorshipService.cancel(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/sponsorship/:id/status
  async status(req, res, next) {
    try {
      const result = await SponsorshipService.getStatus(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
