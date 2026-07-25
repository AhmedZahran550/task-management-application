import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Pagination,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Navbar } from '../components/common/Navbar';
import { TaskFiltersBar } from '../components/tasks/TaskFiltersBar';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskCard } from '../components/tasks/TaskCard';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBanner } from '../components/common/ErrorBanner';
import {
  useGetTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useDeleteAttachment,
} from '../hooks/useTasks';
import type { ITask, TaskQueryDTO, TaskStatus } from '../types/task';

export const TasksPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Query & Filter state
  const [filters, setFilters] = useState<TaskQueryDTO>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    status: '',
    priority: '',
  });

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Modals state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Snackbar notification
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch } = useGetTasks(filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteAttachmentMutation = useDeleteAttachment();

  const tasks = data?.tasks || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  // Filter change handler
  const handleFilterChange = (newFilters: Partial<TaskQueryDTO>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: '',
      status: '',
      priority: '',
    });
  };

  // Create / Edit Task Submit
  const handleSaveTask = async (formData: FormData) => {
    try {
      if (taskToEdit) {
        await updateTaskMutation.mutateAsync({ id: taskToEdit._id, data: formData });
        setToast({ open: true, message: 'Task updated successfully', severity: 'success' });
      } else {
        await createTaskMutation.mutateAsync(formData);
        setToast({ open: true, message: 'Task created successfully', severity: 'success' });
      }
      setFormDialogOpen(false);
      setTaskToEdit(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save task';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  // Delete Task
  const handleConfirmDelete = async () => {
    if (!taskToDeleteId) return;
    try {
      await deleteTaskMutation.mutateAsync(taskToDeleteId);
      setToast({ open: true, message: 'Task deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      setTaskToDeleteId(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete task';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  // Delete Attachment
  const handleDeleteAttachment = async (taskId: string, publicId: string) => {
    try {
      await deleteAttachmentMutation.mutateAsync({ taskId, publicId });
      setToast({ open: true, message: 'Attachment removed successfully', severity: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove attachment';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  // Drag & drop status change in Kanban
  const handleKanbanStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({ id: taskId, data: { status: newStatus } });
      setToast({ open: true, message: `Task moved to ${newStatus}`, severity: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task status';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  // Quick stats calculation
  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, backgroundColor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              My Tasks
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => {
              setTaskToEdit(null);
              setFormDialogOpen(true);
            }}
          >
            Create Task
          </Button>
        </Box>

        {/* Quick Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 4,
          }}
        >
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
              <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <ListAltIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totalCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
              <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <HourglassEmptyIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  To Do
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {todoCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
              <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <AssignmentIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  In Progress
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {inProgressCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
              <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <CheckCircleOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {doneCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Task Filters & View Toggle */}
        <TaskFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content View Area */}
        {isLoading ? (
          <LoadingOverlay message="Fetching your tasks..." />
        ) : isError ? (
          <ErrorBanner message={(error as any)?.response?.data?.message || 'Failed to load tasks.'} onRetry={refetch} />
        ) : tasks.length === 0 ? (
          <EmptyState
            onAction={() => {
              setTaskToEdit(null);
              setFormDialogOpen(true);
            }}
          />
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            onTaskStatusChange={handleKanbanStatusChange}
            onEdit={(task: ITask) => {
              setTaskToEdit(task);
              setFormDialogOpen(true);
            }}
            onDelete={(id: string) => {
              setTaskToDeleteId(id);
              setDeleteDialogOpen(true);
            }}
            onDeleteAttachment={handleDeleteAttachment}
          />
        ) : isMobile ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
            {tasks.map((task: ITask) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t: ITask) => {
                  setTaskToEdit(t);
                  setFormDialogOpen(true);
                }}
                onDelete={(id: string) => {
                  setTaskToDeleteId(id);
                  setDeleteDialogOpen(true);
                }}
                onDeleteAttachment={handleDeleteAttachment}
              />
            ))}
          </Box>
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={(t: ITask) => {
              setTaskToEdit(t);
              setFormDialogOpen(true);
            }}
            onDelete={(id: string) => {
              setTaskToDeleteId(id);
              setDeleteDialogOpen(true);
            }}
            onDeleteAttachment={handleDeleteAttachment}
          />
        )}

        {/* Server Pagination Controls */}
        {viewMode === 'list' && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={filters.page || 1}
              onChange={(_e: unknown, newPage: number) => handleFilterChange({ page: newPage })}
              color="primary"
              size="large"
              shape="rounded"
            />
          </Box>
        )}
      </Container>

      {/* Form Modal (Create / Edit) */}
      <TaskFormDialog
        open={formDialogOpen}
        taskToEdit={taskToEdit}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        onSave={handleSaveTask}
        onClose={() => {
          setFormDialogOpen(false);
          setTaskToEdit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone and any attached files will be permanently deleted."
        isLoading={deleteTaskMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTaskToDeleteId(null);
        }}
      />

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
