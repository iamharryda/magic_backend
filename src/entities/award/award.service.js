import Award from './award.model.js';

export const AwardService = {
  async createAward(data) {
    const award = new Award(data);
    return await award.save();
  },

  async getAwards({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
      ];
    }

    const awards = await Award.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Award.countDocuments(queryFilter);

    return {
      awards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getAwardById(id) {
    const award = await Award.findById(id);
    if (!award) {
      const error = new Error('Award item not found');
      error.statusCode = 404;
      throw error;
    }
    return award;
  },

  async updateAward(id, data) {
    const award = await Award.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!award) {
      const error = new Error('Award item not found');
      error.statusCode = 404;
      throw error;
    }
    return award;
  },

  async deleteAward(id) {
    const award = await Award.findByIdAndDelete(id);
    if (!award) {
      const error = new Error('Award item not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Award deleted successfully' };
  },
};
