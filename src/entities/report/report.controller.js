import { ReportService } from './report.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const ReportController = {
  // POST /api/v1/report (Admin)
  async create(req, res, next) {
    try {
      const { title, fileUrl } = req.body;
      if (!title || !fileUrl) {
        return generateResponse(res, 400, false, 'Title and file URL/download link are required', null);
      }

      const report = await ReportService.createReport(req.body);
      return generateResponse(res, 201, true, 'Report created successfully', report);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/report (Public)
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      const search = req.query.search || null;

      const result = await ReportService.getReports({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Reports retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/report/:id (Public)
  async getById(req, res, next) {
    try {
      const report = await ReportService.getReportById(req.params.id);
      return generateResponse(res, 200, true, 'Report details retrieved successfully', report);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/report/:id (Admin)
  async update(req, res, next) {
    try {
      const report = await ReportService.updateReport(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Report updated successfully', report);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/report/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await ReportService.deleteReport(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
