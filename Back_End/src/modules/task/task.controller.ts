import { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const files = req.files as Express.Multer.File[] | undefined;
  const task = await TaskService.createTask(userId, req.body, files);

  return apiResponse({
    res,
    statusCode: 201,
    message: 'Task created successfully',
    data: task,
  });
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const result = await TaskService.getTasks(userId, req.query as any);

  return apiResponse({
    res,
    statusCode: 200,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

export const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const task = await TaskService.getTaskById(userId, req.params.id);

  return apiResponse({
    res,
    statusCode: 200,
    message: 'Task retrieved successfully',
    data: task,
  });
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const files = req.files as Express.Multer.File[] | undefined;
  const task = await TaskService.updateTask(userId, req.params.id, req.body, files);

  return apiResponse({
    res,
    statusCode: 200,
    message: 'Task updated successfully',
    data: task,
  });
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  await TaskService.deleteTask(userId, req.params.id);

  return apiResponse({
    res,
    statusCode: 200,
    message: 'Task deleted successfully',
  });
});

export const removeAttachment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id, publicId } = req.params;
  const task = await TaskService.removeAttachment(userId, id, publicId);

  return apiResponse({
    res,
    statusCode: 200,
    message: 'Attachment removed successfully',
    data: task,
  });
});
