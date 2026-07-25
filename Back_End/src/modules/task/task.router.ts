import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  removeAttachment,
} from './task.controller.js';
import { auth } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { validate } from '../../middleware/validation.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  attachmentParamSchema,
  taskQuerySchema,
} from './task.validation.js';

const router = Router();

// Enforce authentication for all task endpoints
router.use(auth);

router.post(
  '/',
  upload.array('attachments', 3),
  validate(createTaskSchema, 'body'),
  createTask
);

router.get(
  '/',
  validate(taskQuerySchema, 'query'),
  getTasks
);

router.get(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  getTaskById
);

router.patch(
  '/:id',
  upload.array('attachments', 3),
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  updateTask
);

router.delete(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  deleteTask
);

router.delete(
  '/:id/attachments/:publicId',
  validate(attachmentParamSchema, 'params'),
  removeAttachment
);

export default router;
