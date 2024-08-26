import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//authentication
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "lu gak ada Token" });
    const verifiedUser = jwt.verify(token!, process.env.JWT_SECRET_KEY as string);

    if (!verifiedUser) return res.status(401).json({ message: "invalid Token" });
    (req as any).user = verifiedUser;
    next();
  } catch (error) {
    console.error(error);
  }
}

// admin authorization
export async function adminGuatd(req: Request, res: Response, next: NextFunction) {
  try {
    if ((req as any).user.roleId !== 1) return res.status(401).json({ message: "you were not an admin" });

    next();
  } catch (error) {
    console.error(error);
  }
}
