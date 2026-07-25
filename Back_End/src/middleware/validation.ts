import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/appError.js';

type ValidationSource = 'body' | 'params' | 'query';

export const validate = (schema: Schema, source: ValidationSource = 'body'): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }

    req[source] = value;
    next();
  };
};
