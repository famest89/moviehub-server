import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { WatchlistStatus } from '../generated/prisma/enums.js';
import type { Prisma } from '../generated/prisma/client.js';

const getWatchlist = async (req: Request, res: Response) => {
  const { status } = req.query;

  const where: Prisma.WatchlistItemWhereInput = {
    userId: req.user.id,
  };

  if (
    typeof status === 'string' &&
    Object.values(WatchlistStatus).includes(status as WatchlistStatus)
  ) {
    where.status = status as WatchlistStatus;
  }

  const watchlist = await prisma.watchlistItem.findMany({
    where,
    include: {
      movie: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    status: 'success',
    results: watchlist.length,
    data: {
      watchlist,
    },
  });
};

const addToWatchlist = async (req: Request, res: Response) => {
  const { movieId, status, rating, notes } = req.body;

  // Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

  if (!movie) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }

  // Check if already added
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    res.status(400).json({ error: 'Movie already in the watchlist' });
    return;
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || 'PLANNED',
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      watchlistItem,
    },
  });
};

const updateWatchlistItem = async (req: Request, res: Response) => {
  const { status, rating, notes } = req.body;

  //? Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id as string },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: 'Watchlist item not found!' });
  }

  //? Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Not allowed to update this watchlist item',
    });
  }

  //? Build update data
  const updateData: Prisma.WatchlistItemUpdateInput = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  //? Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id as string },
    data: updateData,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      watchlistItem: updatedItem,
    },
  });
};

const removeFromWatchlist = async (req: Request, res: Response) => {
  //? Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id as string },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: 'Watchlist item not found!' });
  }

  //? Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Not allowed to update this watchlist item',
    });
  }

  await prisma.watchlistItem.delete({
    where: { id: req.params.id as string },
  });

  res.status(200).json({
    status: 'Success',
    message: 'Movie removed from watchlist',
  });
};

export {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
};
