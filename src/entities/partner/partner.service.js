import Partner from './partner.model.js';

export const PartnerService = {
  async createPartner(data) {
    const partner = new Partner(data);
    return await partner.save();
  },

  async getPartners({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const partners = await Partner.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Partner.countDocuments(queryFilter);

    return {
      partners,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getPartnerById(id) {
    const partner = await Partner.findById(id);
    if (!partner) {
      const error = new Error('Partner record not found');
      error.statusCode = 404;
      throw error;
    }
    return partner;
  },

  async updatePartner(id, data) {
    const partner = await Partner.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!partner) {
      const error = new Error('Partner record not found');
      error.statusCode = 404;
      throw error;
    }
    return partner;
  },

  async deletePartner(id) {
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      const error = new Error('Partner record not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Partner record deleted successfully' };
  },
};
