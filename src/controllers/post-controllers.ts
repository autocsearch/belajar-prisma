import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function getAllPost(req: Request, res: Response) {
  try {
    const post = await prisma.post.findMany();

    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
  }
}
export async function getSinglePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.postStatistic.update({
      where: {
        id: +id,
      },
      data: {
        viewCount: { increment: 1 },
      },
    });
    const post = await prisma.post.findUnique({
      where: {
        id: +id, // bisa parseint() /number(id)
      },
    });

    if (!post) res.status(404).json({ message: "Post not found" });

    res.status(201).json({ message: post });
  } catch (error) {
    console.error(error);
  }
}
// export async function getPostStatistic(req: Request, res: Response) {
//   try {
//     const { id } = req.params;
//     const views = await prisma.post.findUnique({
//       where: {
//         id: +id,
//       },
//       select: {
//         viewCount: true,
//       },
//     });

//     res.status(201).json({ message: views });
//   } catch (error) {
//     console.error(error);
//   }
// }
export async function searchPost(req: Request, res: Response) {
  try {
    const { text } = req.query;
    console.log(text);

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: text as string,
            },
          },
          {
            content: {
              contains: text as string,
            },
          },
        ],
      },
    });

    res.status(201).json({ data: posts });
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const { title, content, authorId } = req.body;

    if (!req.file) return res.status(400).json({ message: "no file uploaded" });

    const cloudinaryData = await cloudinary.uploader.upload(req.file.path, { folder: "images" });

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(authorId), // kalau angka akan tetap i threat sebagai sting nakanya di jadiin number
        imageUrl: cloudinaryData.secure_url,
      },
    });

    fs.unlink(req.file.path);
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    console.error(error);
  }
}

export async function updatePostContent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content, title } = req.body;

    await prisma.post.update({
      where: {
        id: +id,
      },
      data: {
        content,
        title,
      },
    });

    res.status(201).json({ message: "content updated" });
  } catch (error) {
    console.error(error);
  }
}
export async function togglePostPublishedStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const postData = await prisma.post.findUnique({
      where: {
        id: +id,
      },
    });

    await prisma.post.update({
      where: {
        id: +id,
      },
      data: {
        published: !postData?.published,
      },
    });

    res.status(200).json({ message: `${postData?.published ? "Post is published" : "Post is drafted"}`, data: postData });
  } catch (error) {
    console.error(error);
  }
}
export async function updatePostLikes(req: Request, res: Response) {
  try {
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: {
        id: +id,
      },
    });

    res.status(201).json({ message: "user deleted" });
  } catch (error) {
    console.error(error);
  }
}
