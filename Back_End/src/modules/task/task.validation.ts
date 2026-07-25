import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Task title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  description: Joi.string().trim().max(2000).allow('', null).optional(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').default('To Do'),
  priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  dueDate: Joi.date().iso().required().messages({
    'any.required': 'Due date is required',
    'date.base': 'Please provide a valid ISO date',
  }),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  description: Joi.string().trim().max(2000).allow('', null).optional(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  dueDate: Joi.date().iso().optional(),
});

export const taskIdParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid task ID format',
  }),
});

export const attachmentParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid task ID format',
  }),
  publicId: Joi.string().required().messages({
    'string.empty': 'Attachment public ID is required',
  }),
});

export const taskQuerySchema = Joi.object({
  search: Joi.string().trim().allow('').optional(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'dueDate', 'priority', 'status', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
