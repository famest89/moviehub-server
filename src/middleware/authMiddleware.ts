import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { NextFunction, Request, Response } from 'express';

// Read the token from the request
// Check if token is valid
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided!' });
    return;
  }

  try {
    // Verify token and extract user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === 'string') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token failed!' });
  }
};

export { authMiddleware };
