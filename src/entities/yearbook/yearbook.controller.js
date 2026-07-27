import { YearbookService } from './yearbook.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const YearbookController = {
  // POST /api/v1/yearbook (Admin)
  async create(req, res, next) {
    try {
      const { title, pdfUrl } = req.body;
      if (!title || !pdfUrl) {
        return generateResponse(res, 400, false, 'Title and PDF URL/Google Drive link are required', null);
      }

      const yearbook = await YearbookService.createYearbook(req.body);
      return generateResponse(res, 201, true, 'Yearbook created successfully', yearbook);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/yearbook (Public)
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

      const result = await YearbookService.getYearbooks({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Yearbooks retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/yearbook/:id (Public)
  async getById(req, res, next) {
    try {
      const yearbook = await YearbookService.getYearbookById(req.params.id);
      return generateResponse(res, 200, true, 'Yearbook details retrieved successfully', yearbook);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/yearbook/:id (Admin)
  async update(req, res, next) {
    try {
      const yearbook = await YearbookService.updateYearbook(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Yearbook updated successfully', yearbook);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/yearbook/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await YearbookService.deleteYearbook(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
