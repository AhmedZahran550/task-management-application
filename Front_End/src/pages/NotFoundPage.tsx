import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HomeIcon from '@mui/icons-material/Home';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <SentimentDissatisfiedIcon sx={{ fontSize: 72, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            404
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Page Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button variant="contained" color="primary" startIcon={<HomeIcon />} onClick={() => navigate('/tasks')}>
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
