import { SponsorshipService } from './sponsorship.service.js';

export const SponsorshipController = {
  // POST /api/v1/sponsorships/setup
  async setup(req, res, next) {
    try {
      const { sponsorName, sponsorEmail, childId, amount, interval } = req.body;
      const result = await SponsorshipService.setup({ sponsorName, sponsorEmail, childId, amount, interval });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/sponsorships/subscribe
  async subscribe(req, res, next) {
    try {
      const { sponsorshipId, customerId, paymentMethodId, childId, amount, interval } = req.body;
      const result = await SponsorshipService.subscribe({ sponsorshipId, customerId, paymentMethodId, childId, amount, interval });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/sponsorships/:id/cancel
  async cancel(req, res, next) {
    try {
      const result = await SponsorshipService.cancel(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/sponsorships/:id/status
  async status(req, res, next) {
    try {
      const result = await SponsorshipService.getStatus(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
