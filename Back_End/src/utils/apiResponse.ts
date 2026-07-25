import { Response } from 'express';

interface ApiResponseOptions {
  res: Response;
  statusCode: number;
  message: string;
  data?: any;
}

export const apiResponse = ({ res, statusCode, message, data }: ApiResponseOptions) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};
