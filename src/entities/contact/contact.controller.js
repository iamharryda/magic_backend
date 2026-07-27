import { ContactService } from './contact.service.js';
import { generateResponse } from '../../lib/responseFormate.js';

export const ContactController = {
  // POST /api/v1/contact (Public)
  async create(req, res, next) {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return generateResponse(res, 400, false, 'Name, email, and message are required', null);
      }

      const contact = await ContactService.createContact({
        name,
        email,
        phone,
        subject,
        message,
      });

      return generateResponse(res, 201, true, 'Contact message submitted successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/contact (Admin)
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

      const result = await ContactService.getContacts({ filter, skip, limit, page, search });
      return generateResponse(res, 200, true, 'Contact submissions retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/contact/:id (Admin)
  async getById(req, res, next) {
    try {
      const contact = await ContactService.getContactById(req.params.id);
      return generateResponse(res, 200, true, 'Contact submission retrieved successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/v1/contact/:id (Admin)
  async update(req, res, next) {
    try {
      const contact = await ContactService.updateContact(req.params.id, req.body);
      return generateResponse(res, 200, true, 'Contact submission updated successfully', contact);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/v1/contact/:id (Admin)
  async remove(req, res, next) {
    try {
      const result = await ContactService.deleteContact(req.params.id);
      return generateResponse(res, 200, true, result.message, null);
    } catch (error) {
      next(error);
    }
  },
};
