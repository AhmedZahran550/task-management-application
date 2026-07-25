import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'You have no tasks matching your filters. Try clearing your filters or create a new task.',
  onAction,
  actionText = 'Create New Task',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        border: '2px dashed rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        textAlign: 'center',
        backgroundColor: 'rgba(17, 24, 39, 0.4)',
      }}
    >
      <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>
      {onAction && (
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
