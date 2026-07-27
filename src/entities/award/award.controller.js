import { AwardService } from './award.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const AwardController = {
  // POST /api/v1/award (Admin)
  async create(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return generateResponse(res, 400, false, 'Title and description are required', null);
      }

      const award = await AwardService.createAward(req.body);
      return generateResponse(res, 201, true, 'Award created successfully', award);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/award (Public)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.year) {
        filter.year = req.query.year;
      }

      const search = req.query.search || null;

      const result = await AwardService.getAwards({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Awards retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/award/:id (Public)
  async getById(req, res, next) {
    try {
      const award = await AwardService.getAwardById(req.params.id);
      return generateResponse(res, 200, true, 'Award details retrieved successfully', award);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/award/:id (Admin)
  async update(req, res, next) {
    try {
      const award = await AwardService.updateAward(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Award updated successfully', award);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/award/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await AwardService.deleteAward(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
