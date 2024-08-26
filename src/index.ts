import express from "express";
import userRouter from "./routes/user-routes";
import postRouter from "./routes/post-routes";
import authRouter from "./routes/auth-router";
import { verifyToken, adminGuatd } from "./middleware/auth-middleware";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

//read req.body
app.use(express.json());

//red req.cookie
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", verifyToken, adminGuatd, postRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
