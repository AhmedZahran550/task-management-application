import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { ITask, TaskQueryDTO, PaginatedTasksResult } from '../types/task';
import type { ApiResponse } from '../types/auth';

export const TASKS_QUERY_KEY = ['tasks'];

export const useGetTasks = (query: TaskQueryDTO) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query.search) params.append('search', query.search);
      if (query.status) params.append('status', query.status);
      if (query.priority) params.append('priority', query.priority);
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const response = await api.get<ApiResponse<PaginatedTasksResult>>(`/tasks?${params.toString()}`);
      return response.data.data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post<ApiResponse<ITask>>('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | Record<string, any> }) => {
      const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await api.patch<ApiResponse<ITask>>(`/tasks/${id}`, data, { headers });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, publicId }: { taskId: string; publicId: string }) => {
      const response = await api.delete<ApiResponse<ITask>>(`/tasks/${taskId}/attachments/${encodeURIComponent(publicId)}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
