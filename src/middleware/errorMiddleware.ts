import { Prisma } from '../generated/prisma/client.js';

import { NextFunction, Request, Response } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

/**
 * 404 Not Found handler
 * Creates an error for routes that don't exist
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler middleware
 * Handles all errors in the application and sends appropriate responses
 * Provides detailed error information in development, minimal info in production
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let status = 'error';
  let message = err.message;

  // Handle custom application errors
  if ('statusCode' in err) {
    const appError = err as AppError;
    statusCode = appError.statusCode ?? 500;
    status = appError.status ?? (statusCode < 500 ? 'fail' : 'error');
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    status = 'fail';
    message = 'Invalid data provided';
  }

  // Handle Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 'fail';

    switch (err.code) {
      case 'P2002': {
        const target = err.meta?.target;

        const field =
          Array.isArray(target) && target.length > 0
            ? String(target[0])
            : 'field';

        statusCode = 400;
        message = `${field} already exists`;
        break;
      }

      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference: related record does not exist';
        break;

      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
    }
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

export { notFound, errorHandler };
