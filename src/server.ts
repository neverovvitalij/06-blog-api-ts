import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const PORT = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//GET Posts by Category,Tag and Published
app.get('/posts', async (req: Request, res: Response) => {
  const { category, tag, published, page, limit } = req.query as {
    category?: string;
    tag?: string;
    published?: string;
    page?: string;
    limit?: string;
  };

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;

  try {
    const where: Prisma.PostWhereInput = {};

    if (category) {
      where.categories = {
        some: { name: category },
      };
    }
    if (tag) {
      where.tags = {
        some: { name: tag },
      };
    }
    if (published) {
      where.published = published === 'true';
    }

    const posts = await prisma.post.findMany({
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
      where,
      include: { author: true, categories: true, tags: true },
    });

    const total = await prisma.post.count({ where });
    const totalPages = Math.ceil(total / currentLimit);

    res.status(200).json({
      posts: posts,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total: total,
        totalPages: totalPages,
      },
    });
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

//POST Add Comment to Post
app.post('/posts/:id/comments', async (req: Request, res: Response) => {
  const { text, authorId } = req.body;
  const { id } = req.params;

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        postId: Number(id),
        authorId: Number(authorId),
      },
      include: { author: true },
    });

    res.status(201).json({ comment });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({ error: 'Post or author not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//GET get all Posts from Comment
app.get('/posts/:id/comments', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(id) },
      include: { author: true },
    });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

//POST Add Category
app.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const category = await prisma.category.create({ data: { name } });

    res.status(201).json({ category });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//POST Add Tag
app.post('/tags', async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const tag = await prisma.tag.create({ data: { name } });

    res.status(201).json({ tag });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ error: 'Tag already exists' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

//PUT Add Category to the Post
app.put('/posts/:id/categories', async (req: Request, res: Response) => {
  const { categoryIds } = req.body;
  const postId = req.params.id;

  const connectData = categoryIds.map((id: number) => ({ id: Number(id) }));

  try {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        categories: { connect: connectData },
      },
      include: { categories: true },
    });

    res.status(200).json({ post });
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

//PUT Add Tag to the Post
app.put('/posts/:id/tags', async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { tagIds } = req.body;

  const connectData = tagIds.map((id: number) => ({ id: Number(id) }));

  try {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        tags: { connect: connectData },
      },
      include: { tags: true },
    });

    res.status(200).json({ post });
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
