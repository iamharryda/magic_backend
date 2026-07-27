import News from './news.model.js';

export const NewsService = {
  async createNews(data) {
    const news = new News(data);
    return await news.save();
  },

  async getNewsList({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const news = await News.find(queryFilter)
      .sort({ publishedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(queryFilter);

    return {
      news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getNewsById(id) {
    const news = await News.findById(id);
    if (!news) {
      const error = new Error('News item not found');
      error.statusCode = 404;
      throw error;
    }
    return news;
  },

  async updateNews(id, data) {
    const news = await News.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!news) {
      const error = new Error('News item not found');
      error.statusCode = 404;
      throw error;
    }
    return news;
  },

  async deleteNews(id) {
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      const error = new Error('News item not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'News item deleted successfully' };
  },
};
