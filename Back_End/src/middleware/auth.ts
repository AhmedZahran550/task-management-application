import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../DB/models/user.model.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

export const auth = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return next(new AppError('JWT secret configuration missing', 500));
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token', 401));
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    return next(new AppError('User belonging to this token no longer exists', 401));
  }

  req.user = user;
  next();
});
