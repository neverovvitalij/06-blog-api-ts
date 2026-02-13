import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создать пользователя
  const user = await prisma.user.create({
    data: {
      email: 'testOW2@test.com',
      name: 'Test User',
    },
  });

  console.log('Created user:', user.id);

  for (let i = 1; i <= 1000; i++) {
    await prisma.post.create({
      data: {
        title: `Test Post ${i}`,
        content: `Content ${i}`,
        published: i % 2 === 0,
        authorId: user.id,
      },
    });
  }

  console.log('Created 1000 posts!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
