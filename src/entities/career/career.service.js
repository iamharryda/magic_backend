import Career from './career.model.js';
import CareerApplication from './careerApplication.model.js';

export const CareerService = {
  // Career CRUD
  async createCareer(data) {
    const career = new Career(data);
    return await career.save();
  },

  async getCareers({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const careers = await Career.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Career.countDocuments(queryFilter);

    return {
      careers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getCareerById(id) {
    const career = await Career.findById(id);
    if (!career) {
      const error = new Error('Career not found');
      error.statusCode = 404;
      throw error;
    }
    return career;
  },

  async updateCareer(id, data) {
    const career = await Career.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!career) {
      const error = new Error('Career not found');
      error.statusCode = 404;
      throw error;
    }
    return career;
  },

  async deleteCareer(id) {
    const career = await Career.findByIdAndDelete(id);
    if (!career) {
      const error = new Error('Career not found');
      error.statusCode = 404;
      throw error;
    }
    // Delete associated applications
    await CareerApplication.deleteMany({ careerId: id });
    return { message: 'Career and related applications deleted successfully' };
  },

  // Candidate Application Management
  async applyForCareer(data) {
    // Verify career exists and is open
    const career = await Career.findById(data.careerId);
    if (!career) {
      const error = new Error('Career not found');
      error.statusCode = 404;
      throw error;
    }
    if (career.status === 'closed') {
      const error = new Error('This career position is closed');
      error.statusCode = 400;
      throw error;
    }

    const application = new CareerApplication(data);
    return await application.save();
  },

  async getApplications({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await CareerApplication.find(queryFilter)
      .populate('careerId', 'title department location status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CareerApplication.countDocuments(queryFilter);

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getApplicationById(id) {
    const application = await CareerApplication.findById(id).populate('careerId');
    if (!application) {
      const error = new Error('Candidate application not found');
      error.statusCode = 404;
      throw error;
    }
    return application;
  },

  async updateApplication(id, data) {
    const application = await CareerApplication.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('careerId');
    if (!application) {
      const error = new Error('Candidate application not found');
      error.statusCode = 404;
      throw error;
    }
    return application;
  },

  async deleteApplication(id) {
    const application = await CareerApplication.findByIdAndDelete(id);
    if (!application) {
      const error = new Error('Candidate application not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Candidate application deleted successfully' };
  },
};
