import { PartnerService } from './partner.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const PartnerController = {
  // POST /api/v1/partner (Public application submission or Admin creation)
  async create(req, res, next) {
    try {
      const { companyName, email } = req.body;
      if (!companyName || !email) {
        return generateResponse(res, 400, false, 'Company name and email are required', null);
      }

      const partner = await PartnerService.createPartner(req.body);
      return generateResponse(res, 201, true, 'Partner application/record created successfully', partner);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/partner (Public or Admin, filter by status like ?status=active_partner or ?status=applied)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status.toLowerCase();
      }

      const search = req.query.search || null;

      const result = await PartnerService.getPartners({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Partner list retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/partner/:id
  async getById(req, res, next) {
    try {
      const partner = await PartnerService.getPartnerById(req.params.id);
      return generateResponse(res, 200, true, 'Partner details retrieved successfully', partner);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/partner/:id (Admin update data or status)
  async update(req, res, next) {
    try {
      const partner = await PartnerService.updatePartner(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Partner record updated successfully', partner);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/partner/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await PartnerService.deletePartner(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
