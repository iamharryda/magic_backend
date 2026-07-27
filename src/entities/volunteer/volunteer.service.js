import Volunteer from './volunteer.model.js';

export const VolunteerService = {
  async createVolunteer(data) {
    const volunteer = new Volunteer(data);
    return await volunteer.save();
  },

  async getVolunteers({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const volunteers = await Volunteer.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Volunteer.countDocuments(queryFilter);

    return {
      volunteers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getVolunteerById(id) {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      const error = new Error('Volunteer record not found');
      error.statusCode = 404;
      throw error;
    }
    return volunteer;
  },

  async updateVolunteer(id, data) {
    const volunteer = await Volunteer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!volunteer) {
      const error = new Error('Volunteer record not found');
      error.statusCode = 404;
      throw error;
    }
    return volunteer;
  },

  async deleteVolunteer(id) {
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      const error = new Error('Volunteer record not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Volunteer record deleted successfully' };
  },
};
