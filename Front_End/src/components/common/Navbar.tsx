import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                width: 40,
                height: 40,
              }}
            >
              <TaskAltIcon />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskFlow Pro
            </Typography>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'secondary.main',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                  {user.name}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
