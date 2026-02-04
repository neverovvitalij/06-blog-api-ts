import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const PORT = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//GET all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { posts: true } });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

//POST create user
app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({ data: { email, name } });

    res.status(201).json({ user });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//GET posts
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({ include: { author: true } });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

//POST create post
app.post('/posts', async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(authorId),
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//GET post with Id
app.get('/posts/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: true,
      },
    });

    if (post === null) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

//PUT update post
app.put('/posts/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, content, published } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//DELETE post
app.delete('/posts/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.post.delete({ where: { id: Number(id) } });

    res.status(204).end();
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
