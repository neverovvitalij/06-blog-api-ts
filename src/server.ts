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

//GET posts
app.get('/posts', async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ include: { author: true } });

  res.status(200).json({ posts });
});

//POST create post
app.post('/posts', async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: Number(authorId),
    },
  });

  res.status(201).json({ post });
});

//GET post with Id
app.get('/posts/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      author: true,
    },
  });

  res.status(200).json({ post });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
