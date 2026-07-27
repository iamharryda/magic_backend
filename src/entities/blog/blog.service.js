import Blog from './blog.model.js';

export const BlogService = {
  async createBlog(data) {
    const blog = new Blog(data);
    return await blog.save();
  },

  async getBlogs({ filter = {}, skip = 0, limit = 10, page = 1, search = null }) {
    let queryFilter = { ...filter };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(queryFilter)
      .sort({ publishedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(queryFilter);

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getBlogById(id) {
    const blog = await Blog.findById(id);
    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }
    return blog;
  },

  async updateBlog(id, data) {
    const blog = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }
    return blog;
  },

  async deleteBlog(id) {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Blog post deleted successfully' };
  },
};
