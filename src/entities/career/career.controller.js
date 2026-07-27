import { CareerService } from './career.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const CareerController = {
  // --- Career CRUD ---
  // POST /api/v1/career (Admin)
  async create(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return generateResponse(res, 400, false, 'Title and description are required', null);
      }

      const career = await CareerService.createCareer(req.body);
      return generateResponse(res, 201, true, 'Career position created successfully', career);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/career (Public)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status.toLowerCase();
      }
      if (req.query.jobType) {
        filter.jobType = req.query.jobType.toLowerCase();
      }

      const search = req.query.search || null;

      const result = await CareerService.getCareers({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Career positions retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/career/:id (Public)
  async getById(req, res, next) {
    try {
      const career = await CareerService.getCareerById(req.params.id);
      return generateResponse(res, 200, true, 'Career details retrieved successfully', career);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/career/:id (Admin)
  async update(req, res, next) {
    try {
      const career = await CareerService.updateCareer(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Career updated successfully', career);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/career/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await CareerService.deleteCareer(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },

  // --- Candidate Applications ---
  // POST /api/v1/career/apply or /api/v1/career/:id/apply (Public)
  async apply(req, res, next) {
    try {
      const careerId = req.params.id || req.body.careerId;
      const { fullName, email, phone, resumeUrl, coverLetter, portfolioUrl } = req.body;

      if (!careerId || !fullName || !email || !phone || !resumeUrl) {
        return generateResponse(
          res,
          400,
          false,
          'Career ID, full name, email, phone, and resume URL are required',
          null
        );
      }

      const application = await CareerService.applyForCareer({
        careerId,
        fullName,
        email,
        phone,
        resumeUrl,
        coverLetter,
        portfolioUrl,
      });

      return generateResponse(res, 201, true, 'Application submitted successfully', application);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/career/applications (Admin)
  async listApplications(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.careerId) {
        filter.careerId = req.query.careerId;
      }
      if (req.query.status) {
        filter.status = req.query.status.toLowerCase();
      }

      const search = req.query.search || null;

      const result = await CareerService.getApplications({ filter, skip, limit, page, search });
      return generateResponse(
        res,
        200,
        true,
        'Candidate applications retrieved successfully',
        result
      );
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/career/applications/:id (Admin)
  async getApplicationById(req, res, next) {
    try {
      const application = await CareerService.getApplicationById(req.params.id);
      return generateResponse(
        res,
        200,
        true,
        'Candidate application details retrieved successfully',
        application
      );
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/career/applications/:id (Admin)
  async updateApplication(req, res, next) {
    try {
      const application = await CareerService.updateApplication(req.params.id, req.body);
      return generateResponse(
        res,
        200,
        true,
        'Candidate application updated successfully',
        application
      );
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/career/applications/:id (Admin)
  async removeApplication(req, res, next) {
    try {
      const result = await CareerService.deleteApplication(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
