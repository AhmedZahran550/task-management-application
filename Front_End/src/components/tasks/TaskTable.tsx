import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ITask, TaskPriority, TaskStatus } from '../../types/task';
import { AttachmentViewer } from './AttachmentViewer';

interface TaskTableProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onDeleteAttachment?: (taskId: string, publicId: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onDeleteAttachment,
}) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Done':
        return 'success';
      default:
        return 'default';
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

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Attachments</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

            return (
              <TableRow key={task._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        mt: 0.5,
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={task.status} color={getStatusColor(task.status) as any} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={task.priority} color={getPriorityColor(task.priority) as any} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color={isOverdue ? 'error.main' : 'text.primary'} sx={{ fontWeight: isOverdue ? 600 : 400 }}>
                    {formattedDate} {isOverdue && '(Overdue)'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {task.attachments && task.attachments.length > 0 ? (
                    <AttachmentViewer
                      attachments={task.attachments}
                      onDeleteAttachment={(publicId) => onDeleteAttachment && onDeleteAttachment(task._id, publicId)}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      None
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
