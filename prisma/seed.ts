import { PrismaClient, Prisma } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

async function inputData() {
  console.log("start seeding...");

  const salt = await genSalt(10);

  const adminRole = await prisma.role.create({
    data: {
      position: "admin",
    },
  });

  const authorRole = await prisma.role.create({
    data: {
      position: "author",
    },
  });
  const userData: Prisma.UserCreateInput[] = [
    {
      name: "momod",
      email: "momod@gmail.com",
      password: await hash("suppermomod", salt),
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
    {
      name: "warga",
      email: "rakyat@gmail.com",
      password: "suppermomod",
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
    {
      name: "parvatis",
      email: "parvatis98@gmil.com",
      password: await hash("parvatis019", salt),
      post: {
        create: [
          {
            title: "bisimillah win",
            content: "visi depo misi jackpot  misi  depo doang jackpot kaga",
            statistic: { create: {} },
          },
        ],
      },
      role: {
        connect: { id: authorRole.id },
      },
    },
    {
      name: "charles",
      email: "charlesduo@gmail.com",
      password: await hash("parvatis018", salt),
      post: {
        create: [
          {
            title: "bisimillah win",
            content: "visi depo misi jackpot  misi  depo doang jackpot kaga",
            statistic: { create: {} },
          },
        ],
      },
      role: {
        connect: { id: authorRole.id },
      },
    },
    {
      name: "ridwan",
      email: "kamil@gmail.com",
      password: await hash("parvatis017", salt),
      post: {
        create: [
          {
            title: "bisimillah win",
            content: "visi depo misi jackpot  misi  depo doang jackpot kaga",
            statistic: { create: {} },
          },
        ],
      },
      role: {
        connect: { id: authorRole.id },
      },
    },
  ];

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`succesfully create user with id ${user.id}`);
  }
  console.log("seeding data finished!");
}

inputData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    console.error(Error);
    await prisma.$disconnect();
    process.exit(1); // 1 means shutdown
  });
