import { DonationService } from './donation.service.js';

export const DonationController = {
  // POST /api/v1/donations/checkout
  async createCheckout(req, res, next) {
    try {
      const { donorName, donorEmail, amount, message, successUrl, returnUrl } = req.body;
      const result = await DonationService.createCheckout({ donorName, donorEmail, amount, message, successUrl, returnUrl });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/donations
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }

      const result = await DonationService.list({ filter, skip, limit, page });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
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
