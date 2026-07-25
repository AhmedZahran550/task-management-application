import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ title = 'Error', message }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
