import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создать пользователя
  const user = await prisma.user.create({
    data: {
      email: 'testOW@test.com',
      name: 'Test User',
    },
  });

  console.log('Created user:', user.id);

  // Создать 30 постов
  for (let i = 1; i <= 30; i++) {
    await prisma.post.create({
      data: {
        title: `Test Post ${i}`,
        content: `This is content for post number ${i}`,
        published: i % 2 === 0, // чётные опубликованы
        authorId: user.id,
      },
    });
  }

  console.log('Created 30 posts!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
