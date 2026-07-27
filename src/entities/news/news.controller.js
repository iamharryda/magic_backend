import { NewsService } from './news.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const NewsController = {
  // POST /api/v1/news (Admin)
  async create(req, res, next) {
    try {
      const { title } = req.body;
      if (!title) {
        return generateResponse(res, 400, false, 'Title is required', null);
      }

      const news = await NewsService.createNews(req.body);
      return generateResponse(res, 201, true, 'News created successfully', news);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/news (Public)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      const search = req.query.search || null;

      const result = await NewsService.getNewsList({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'News list retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/news/:id (Public)
  async getById(req, res, next) {
    try {
      const news = await NewsService.getNewsById(req.params.id);
      return generateResponse(res, 200, true, 'News details retrieved successfully', news);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/news/:id (Admin)
  async update(req, res, next) {
    try {
      const news = await NewsService.updateNews(req.params.id, req.body);
      return generateResponse(res, 200, true, 'News updated successfully', news);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/news/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await NewsService.deleteNews(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
