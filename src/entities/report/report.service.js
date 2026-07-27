import Report from './report.model.js';

export const ReportService = {
  async createReport(data) {
    const report = new Report(data);
    return await report.save();
  },

  async getReports({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await Report.find(queryFilter)
      .sort({ publishedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(queryFilter);

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getReportById(id) {
    const report = await Report.findById(id);
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }
    return report;
  },

  async updateReport(id, data) {
    const report = await Report.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }
    return report;
  },

  async deleteReport(id) {
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Report deleted successfully' };
  },
};
