import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    res.status(400).json({ error: 'User already exists with this email' });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Check if user email exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Generate JWT Token
  

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: email,
      },
    },
  });
};

export { login, register };
