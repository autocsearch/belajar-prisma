import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Get all of our existing users
export async function getAllUser(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.status(201).json({ data: users });
  } catch (error) {
    console.error(error);
  }
}

// Get only single user by ther ID
export async function getSingleUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: +id, // bisa parseint()
      },
    });
    res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
  }
}

// Create new user
// export async function createUser(req: Request, res: Response) {
//   try {
//     const { name, email, post } = req.body;

//     const postData = post?.map((item: Prisma.PostCreateInput) => {
//       return { title: item.title, content: item.content, viewPoint: item.viewCount };
//     });

//     await prisma.user.create({
//       data: {
//         email,
//         name,
//         post: {
//           create: postData,
//         },
//       },
//     });

//     res.status(201).json({ message: "user created" });
//   } catch (error) {
//     console.error(error);
//   }
// }

// update existing user
export async function updateUser(req: Request, res: Response) {
  try {
    const { email, name } = req.body;
    const { id } = req.params;
    await prisma.user.update({
      where: {
        id: +id,
      },
      data: {
        name,
        email,
      },
    });

    res.status(201).json({ message: "user updated" });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: +id,
      },
    });

    res.status(201).json({ message: "user deleted" });
  } catch (error) {
    console.error(error);
  }
}
