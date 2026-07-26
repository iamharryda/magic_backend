import { DonationService } from './donation.service.js';

export const DonationController = {
  // POST /api/v1/donations/checkout
  async createCheckout(req, res, next) {
    try {
      const { donorName, donorEmail, amount, message } = req.body;
      const result = await DonationService.createCheckout({ donorName, donorEmail, amount, message });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/donations/confirm?session_id=cs_test_...
  async confirm(req, res, next) {
    try {
      const sessionId = req.query.session_id || req.body.sessionId;
      const result = await DonationService.confirm(sessionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
