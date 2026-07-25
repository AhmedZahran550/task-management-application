import Express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import taskRouter from "./modules/task/task.router.js";
import { AppError } from "./utils/appError.js";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Handle Multer errors
  if (err.name === "MulterError" || err.storageErrors) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds maximum allowed limit of 5MB";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Too many files uploaded. Maximum is 3 files per request";
    } else {
      message = err.message || "File upload error";
    }
  }

  const isDev = process.env.NODE_ENV === "development";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

export const initApp = (app: Application, express: typeof Express) => {
  // Connect to Database
  connectDB();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    }),
  );

  // dev environment loger
  app.use(morgan("dev"));

  // Root endpoint
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Task Management API Service is running",
      version: "1.0.0",
    });
  });

  // Module Routers
  app.use("/api/auth", authRouter);
  app.use("/api/tasks", taskRouter);

  // 404 Route Handler
  app.all("*", (req: Request, _res: Response, next: NextFunction) => {
    next(
      new AppError(`Cannot find route ${req.originalUrl} on this server`, 404),
    );
  });

  // Global Error Handler Middleware
  app.use(globalErrorHandler);
};
