import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  FormHelperText,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      passwordPattern,
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

type RegisterValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await register(values);
      navigate('/tasks');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.15) 0%, rgba(11, 15, 25, 1) 70%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ p: 1, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
                  width: 52,
                  height: 52,
                  mb: 1.5,
                }}
              >
                <PersonAddIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Get started with TaskFlow Pro today
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }: any) => (
                    <Box>
                      <TextField
                        {...field}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormHelperText sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                        Must be 8+ chars with uppercase, lowercase, number & special char.
                      </FormHelperText>
                    </Box>
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 1.4, fontSize: '1rem' }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Register'}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink as any} to="/login" underline="hover" color="secondary.light" sx={{ fontWeight: 600 }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
