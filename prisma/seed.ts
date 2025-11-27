import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.setting.createMany({
    data: [
      {
        key: 'allow_guests',
        value: 'true',
        description: 'Allow guests to join the chat without registration',
      },
      {
        key: 'min_username_length',
        value: '3',
        description: 'Minimum length for usernames',
      },
      {
        key: 'max_username_length',
        value: '20',
        description: 'Maximum length for usernames',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
