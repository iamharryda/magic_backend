import { VolunteerService } from './volunteer.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const VolunteerController = {
  // POST /api/v1/volunteer (Public application submission or Admin creation)
  async create(req, res, next) {
    try {
      const { companyName, email } = req.body;
      if (!companyName || !email) {
        return generateResponse(res, 400, false, 'Company/Applicant name and email are required', null);
      }

      const volunteer = await VolunteerService.createVolunteer(req.body);
      return generateResponse(res, 201, true, 'Volunteer application/record created successfully', volunteer);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/volunteer (Public or Admin, filter by status like ?status=working or ?status=applied)
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

      const result = await VolunteerService.getVolunteers({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Volunteer list retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/volunteer/:id
  async getById(req, res, next) {
    try {
      const volunteer = await VolunteerService.getVolunteerById(req.params.id);
      return generateResponse(res, 200, true, 'Volunteer details retrieved successfully', volunteer);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/volunteer/:id (Admin update data or status)
  async update(req, res, next) {
    try {
      const volunteer = await VolunteerService.updateVolunteer(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Volunteer record updated successfully', volunteer);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/volunteer/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await VolunteerService.deleteVolunteer(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
