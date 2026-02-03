import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const PORT = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//GET all users
app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { posts: true } });

  res.status(200).json({ users });
});

//POST create user
app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;

  const user = await prisma.user.create({ data: { email, name } });

  res.status(201).json({ user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
