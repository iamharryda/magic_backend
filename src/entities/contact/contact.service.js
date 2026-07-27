import Contact from './contact.model.js';

export const ContactService = {
  async createContact(data) {
    const contact = new Contact(data);
    return await contact.save();
  },

  async getContacts({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await Contact.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(queryFilter);

    return {
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getContactById(id) {
    const contact = await Contact.findById(id);
    if (!contact) {
      const error = new Error('Contact submission not found');
      error.statusCode = 404;
      throw error;
    }
    return contact;
  },

  async updateContact(id, data) {
    const contact = await Contact.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      const error = new Error('Contact submission not found');
      error.statusCode = 404;
      throw error;
    }
    return contact;
  },

  async deleteContact(id) {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      const error = new Error('Contact submission not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Contact submission deleted successfully' };
  },
};
