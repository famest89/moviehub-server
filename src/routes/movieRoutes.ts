import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ httpMethod: 'GET' });
});

export default router;
