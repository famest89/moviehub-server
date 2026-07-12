import express from 'express';

import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidators.js';

const router = express.Router();

// use middleware on all routes in this file
router.use(authMiddleware);

// use middleware on single route
// router.post('/', authMiddleware, addToWatchlist);

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);
router.put('/:id', validateRequest(addToWatchlistSchema), updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;
