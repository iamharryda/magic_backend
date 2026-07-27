import Yearbook from './yearbook.model.js';

export const YearbookService = {
  async createYearbook(data) {
    const yearbook = new Yearbook(data);
    return await yearbook.save();
  },

  async getYearbooks({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const yearbooks = await Yearbook.find(queryFilter)
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Yearbook.countDocuments(queryFilter);

    return {
      yearbooks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getYearbookById(id) {
    const yearbook = await Yearbook.findById(id);
    if (!yearbook) {
      const error = new Error('Yearbook not found');
      error.statusCode = 404;
      throw error;
    }
    return yearbook;
  },

  async updateYearbook(id, data) {
    const yearbook = await Yearbook.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!yearbook) {
      const error = new Error('Yearbook not found');
      error.statusCode = 404;
      throw error;
    }
    return yearbook;
  },

  async deleteYearbook(id) {
    const yearbook = await Yearbook.findByIdAndDelete(id);
    if (!yearbook) {
      const error = new Error('Yearbook not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Yearbook deleted successfully' };
  },
};
