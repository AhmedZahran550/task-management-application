export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface IAttachment {
  _id?: string;
  url: string;
  publicId: string;
  originalName: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  user: string;
  attachments: IAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskQueryDTO {
  search?: string;
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTasksResult {
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
