import Event from './event.model.js';

export const EventService = {
  async createEvent(data) {
    const event = new Event(data);
    return await event.save();
  },

  async getEvents({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(queryFilter)
      .sort({ eventDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(queryFilter);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getEventById(id) {
    const event = await Event.findById(id);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    return event;
  },

  async updateEvent(id, data) {
    const event = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    return event;
  },

  async deleteEvent(id) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Event deleted successfully' };
  },
};
