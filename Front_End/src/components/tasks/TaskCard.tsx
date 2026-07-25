import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import type { ITask, TaskPriority, TaskStatus } from '../../types/task';
import { AttachmentViewer } from './AttachmentViewer';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onDeleteAttachment?: (taskId: string, publicId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onDeleteAttachment,
}) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do':
        return { color: 'warning', label: 'To Do' };
      case 'In Progress':
        return { color: 'info', label: 'In Progress' };
      case 'Done':
        return { color: 'success', label: 'Done' };
      default:
        return { color: 'default', label: status };
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formattedDueDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const statusInfo = getStatusColor(task.status);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover .task-actions': {
          opacity: 1,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color as any}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`${task.priority} Priority`}
            color={getPriorityColor(task.priority) as any}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, wordBreak: 'break-word', mb: 1 }}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {task.description}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          px: 2,
          pb: 2,
          pt: 0,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          mt: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isOverdue ? 'error.main' : 'text.secondary' }}>
            <EventIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: isOverdue ? 600 : 400 }}>
              {formattedDueDate}
            </Typography>
          </Box>

          {task.attachments && task.attachments.length > 0 && (
            <AttachmentViewer
              attachments={task.attachments}
              onDeleteAttachment={(publicId) => onDeleteAttachment && onDeleteAttachment(task._id, publicId)}
            />
          )}
        </Box>

        <Box className="task-actions" sx={{ display: 'flex', gap: 0.5, opacity: { xs: 1, sm: 0.8 }, transition: 'opacity 0.2s' }}>
          <Tooltip title="Edit task">
            <IconButton size="small" color="primary" onClick={() => onEdit(task)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete task">
            <IconButton size="small" color="error" onClick={() => onDelete(task._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};
