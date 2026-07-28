import { ProjectService } from './project.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const ProjectController = {
  // POST /api/v1/project
  async create(req, res, next) {
    try {
      const { title, body, coverPhoto, status, tags, publishedDate } = req.body;

      if (!title || !body) {
        return generateResponse(res, 400, false, 'Title and body are required', null);
      }

      const project = await ProjectService.createProject({
        title,
        body,
        coverPhoto,
        status,
        tags,
        publishedDate,
      });

      return generateResponse(res, 201, true, 'Project created successfully', project);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/project
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

      const result = await ProjectService.getProjects({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Projects retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/project/:id
  async getById(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      return generateResponse(res, 200, true, 'Project details retrieved successfully', project);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/project/:id
  async update(req, res, next) {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Project updated successfully', project);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/project/:id
  async remove(req, res, next) {
    try {
      const result = await ProjectService.deleteProject(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
