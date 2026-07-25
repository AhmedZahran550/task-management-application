import mongoose, { Types } from 'mongoose';
import { Task, ITask, IAttachment, TaskStatus, TaskPriority } from '../../../DB/models/task.model.js';
import { AppError } from '../../utils/appError.js';
import { deleteFromCloudinary } from '../../middleware/upload.js';

const MAX_ATTACHMENTS_PER_TASK = 10;

// Escape special regex characters to prevent ReDoS attacks
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate: string | Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | Date;
}

export interface TaskQueryDTO {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
}

export interface PaginatedTasksResult {
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: TaskStats;
}

export class TaskService {
  
  static async createTask(
    userId: string,
    data: CreateTaskDTO,
    files?: Express.Multer.File[]
  ): Promise<ITask> {
    const attachments: IAttachment[] = [];

    if (files && files.length > 0) {
      if (files.length > MAX_ATTACHMENTS_PER_TASK) {
        throw new AppError(`Maximum ${MAX_ATTACHMENTS_PER_TASK} attachments allowed per task`, 400);
      }
      files.forEach((file: any) => {
        attachments.push({
          url: file.path || file.secure_url || file.filename,
          publicId: file.filename || file.public_id || file.path,
          originalName: file.originalname,
        });
      });
    }

    const task = await Task.create({
      ...data,
      user: userId,
      attachments,
    });

    return task;
  }

  static async getTasks(
    userId: string,
    query: TaskQueryDTO
  ): Promise<PaginatedTasksResult> {
    const {
      search,
      status,
      priority,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter query scoped to the authenticated user only
    const filter: any = { user: userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search && search.trim() !== '') {
      const escapedSearch = escapeRegex(search.trim());
      filter.title = { $regex: escapedSearch, $options: 'i' };
    }

    // Stats filter matches search & priority but ignores status filter so card counts stay complete
    const statsFilter: any = { user: new Types.ObjectId(userId) };

    if (priority) {
      statsFilter.priority = priority;
    }

    if (search && search.trim() !== '') {
      const escapedSearch = escapeRegex(search.trim());
      statsFilter.title = { $regex: escapedSearch, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [tasks, total, statusAgg] = await Promise.all([
      Task.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Task.countDocuments(filter),
      Task.aggregate([
        { $match: statsFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const stats: TaskStats = {
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    statusAgg.forEach((item: { _id: string; count: number }) => {
      if (item._id === 'To Do') stats.todo = item.count;
      else if (item._id === 'In Progress') stats.inProgress = item.count;
      else if (item._id === 'Done') stats.done = item.count;
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      total,
      page,
      limit,
      totalPages,
      stats,
    };
  }

  static async getTaskById(userId: string, taskId: string): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  static async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskDTO,
    files?: Express.Multer.File[]
  ): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.dueDate !== undefined) task.dueDate = new Date(data.dueDate);

    if (files && files.length > 0) {
      const totalAfterUpload = task.attachments.length + files.length;
      if (totalAfterUpload > MAX_ATTACHMENTS_PER_TASK) {
        throw new AppError(
          `Cannot add ${files.length} file(s). Task already has ${task.attachments.length} attachment(s) (max ${MAX_ATTACHMENTS_PER_TASK})`,
          400
        );
      }
      const newAttachments: IAttachment[] = files.map((file: any) => ({
        url: file.path || file.secure_url || file.filename,
        publicId: file.filename || file.public_id || file.path,
        originalName: file.originalname,
      }));
      task.attachments.push(...newAttachments);
    }

    await task.save();
    return task;
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Delete associated attachments from Cloudinary
    if (task.attachments && task.attachments.length > 0) {
      for (const attachment of task.attachments) {
        if (attachment.publicId) {
          await deleteFromCloudinary(attachment.publicId);
        }
      }
    }

    await Task.deleteOne({ _id: taskId, user: userId });
  }

  static async removeAttachment(
    userId: string,
    taskId: string,
    publicId: string
  ): Promise<ITask> {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const attachmentIndex = task.attachments.findIndex(
      (att) => att.publicId === publicId || att._id?.toString() === publicId
    );

    if (attachmentIndex === -1) {
      throw new AppError('Attachment not found', 404);
    }

    const [removed] = task.attachments.splice(attachmentIndex, 1);
    if (removed.publicId) {
      await deleteFromCloudinary(removed.publicId);
    }

    await task.save();
    return task;
  }
}
