import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  return apiResponse({
    res,
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  return apiResponse({
    res,
    statusCode: 200,
    message: 'Login successful',
    data: result,
  });
});
