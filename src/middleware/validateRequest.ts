import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validateRequest =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      res.status(400).json({ message: flatErrors.join(', ') });
      return;
    }

    next();
  };
