import { z } from 'zod';

const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(),
  status: z
    .enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
      error: () => ({
        message:
          "Status must be one of: 'PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .min(1, 'Rating must be between 1 and 10')
    .max(10, 'Rating must be between 1 and 10')
    .refine(
      (value) => Number.isInteger(value * 10),
      'Rating can have at most one decimal place',
    )
    .optional(),
  notes: z.string().optional(),
});

export { addToWatchlistSchema };
