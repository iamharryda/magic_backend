import { EventService } from './event.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const EventController = {
  // POST /api/v1/event (Admin)
  async create(req, res, next) {
    try {
      const { title, body, eventDate } = req.body;
      if (!title || !body || !eventDate) {
        return generateResponse(res, 400, false, 'Title, body, and event date are required', null);
      }

      const event = await EventService.createEvent(req.body);
      return generateResponse(res, 201, true, 'Event created successfully', event);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/event (Public)
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

      const result = await EventService.getEvents({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Events retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/event/:id (Public)
  async getById(req, res, next) {
    try {
      const event = await EventService.getEventById(req.params.id);
      return generateResponse(res, 200, true, 'Event details retrieved successfully', event);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/event/:id (Admin)
  async update(req, res, next) {
    try {
      const event = await EventService.updateEvent(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Event updated successfully', event);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/event/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await EventService.deleteEvent(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
