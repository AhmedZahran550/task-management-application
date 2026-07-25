import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ITask } from '../../types/task';

const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional(),
  status: z.enum(['To Do', 'In Progress', 'Done'] as const),
  priority: z.enum(['Low', 'Medium', 'High'] as const),
  dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormDialogProps {
  open: boolean;
  taskToEdit?: ITask | null;
  isLoading?: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  taskToEdit,
  isLoading = false,
  onSave,
  onClose,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const defaultDueDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: defaultDueDate,
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      const formattedDate = new Date(taskToEdit.dueDate).toISOString().split('T')[0];
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: formattedDate,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: defaultDueDate,
      });
    }
    setFiles([]);
    setFileError(null);
  }, [taskToEdit, open, reset, defaultDueDate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const existingCount = taskToEdit?.attachments?.length || 0;
      if (existingCount + files.length + selected.length > 10) {
        setFileError('Maximum 10 attachments allowed per task');
        return;
      }
      for (const file of selected) {
        if (file.size > 5 * 1024 * 1024) {
          setFileError(`File "${file.name}" exceeds 5MB limit`);
          return;
        }
      }
      setFileError(null);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = (values: TaskFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    formData.append('status', values.status);
    formData.append('priority', values.priority);
    formData.append('dueDate', new Date(values.dueDate).toISOString());

    files.forEach((file) => {
      formData.append('attachments', file);
    });

    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </Typography>
        <IconButton size="small" onClick={onClose} disabled={isLoading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Task Title *"
                placeholder="Enter task title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Description"
                placeholder="Add optional details..."
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Controller
              name="status"
              control={control}
              render={({ field }: any) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }: any) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority">
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Controller
            name="dueDate"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Due Date *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
              />
            )}
          />

          {/* Attachments Upload Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Attachments (Images, PDF, Doc - Max 5MB each)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ borderStyle: 'dashed' }}
            >
              Upload Files
              <input type="file" hidden multiple onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx,.txt" />
            </Button>

            {fileError && <FormHelperText error>{fileError}</FormHelperText>}

            {files.length > 0 && (
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {files.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeFile(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
