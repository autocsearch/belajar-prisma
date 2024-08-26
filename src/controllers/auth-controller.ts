import { PrismaClient } from "@prisma/client";
import { Request, Response, text } from "express";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { transporter } from "../config/nodemailer";

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) res.status(409).json({ message: "email has already been used" });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const authorRole = await prisma.role.findUnique({
      where: {
        id: 2,
        position: "author",
      },
    });

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: {
          connect: { id: authorRole!.id },
        },
        emailConfirmer: false,
      },
    });

    const token = crypto.randomBytes(20).toString("hex");
    const confirmationLink = `http:localhost:${process.env.PORT}/api/v1/auth/confirm-email?token=${token}`;

    await prisma.token.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        userId: newUser.id,
      },
    });

    await transporter.sendMail({
      from: `jscwd-2904 <no-reply @jcwd.com>`,
      to: email,
      subject: "email confrmation",
      text: `please confirm your email by clicking on the following link: ${confirmationLink}`,
      html: `<p>please confirm your email by clicking on the following link: <a href="${confirmationLink}"></a></p>`,
    });

    res.status(201).json({ message: "userCreated", data: newUser });
  } catch (error) {
    console.error(error);
  }
}

export async function confirmEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "token is required" });

    const tokenRecord = await prisma.token.findUnique({
      where: {
        token: token.toString(),
      },
    });
    if (!tokenRecord || tokenRecord.used || tokenRecord.expiresAt < new Date()) return res.status(401).json({ message: "invalid or epired token" });

    //mark the token as used

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    // mark the email as confirmed
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        emailConfirmer: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "required is missing" });

    const user = await prisma.user.findUnique({
      where: {
        email,
        emailConfirmer: true,
      },
    });
    if (!user || !user.emailConfirmer) res.status(404).json({ message: "email not found" });

    const isValidPass = await compare(password, user?.password!);

    if (!isValidPass) res.status(401).json({ message: "invalid Password" });

    const jwtPayload = { email, roleId: user?.roleId };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, sameSite: true }).status(201).json({ message: "Login success" }); // hanya http yang bisa membaca tokennya

    res.status(201).json({ message: "Login succes", token });
  } catch (error) {
    console.error(error);
  }
}
