import { BlogService } from './blog.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const BlogController = {
  // POST /api/v1/blog (Admin)
  async create(req, res, next) {
    try {
      const { title, body } = req.body;
      if (!title || !body) {
        return generateResponse(res, 400, false, 'Title and body are required', null);
      }

      const blog = await BlogService.createBlog(req.body);
      return generateResponse(res, 201, true, 'Blog post created successfully', blog);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/blog (Public)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status.toLowerCase();
      }
      if (req.query.tag) {
        filter.tags = req.query.tag.toLowerCase();
      }

      const search = req.query.search || null;

      const result = await BlogService.getBlogs({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Blog posts retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/blog/:id (Public)
  async getById(req, res, next) {
    try {
      const blog = await BlogService.getBlogById(req.params.id);
      return generateResponse(res, 200, true, 'Blog post retrieved successfully', blog);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/blog/:id (Admin)
  async update(req, res, next) {
    try {
      const blog = await BlogService.updateBlog(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Blog post updated successfully', blog);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/blog/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await BlogService.deleteBlog(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
