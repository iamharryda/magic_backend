import Project from './project.model.js';

export const ProjectService = {
  async createProject(data) {
    const { title, body, status, tags, publishedDate } = data;
    const project = new Project({
      title,
      body,
      status,
      tags,
      publishedDate: publishedDate || undefined,
    });
    return await project.save();
  },

  async getProjects({ filter = {}, skip = 0, limit = 10, page = 1, search, sort = { createdAt: -1 } }) {
    const query = { ...filter };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sort).skip(skip).limit(limit),
      Project.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async getProjectById(id) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    return project;
  },

  async updateProject(id, updateData) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const allowedUpdates = ['title', 'body', 'status', 'tags', 'publishedDate'];
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        project[field] = updateData[field];
      }
    });

    return await project.save();
  },

  async deleteProject(id) {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Project deleted successfully' };
  },
};
