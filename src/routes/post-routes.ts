import express from "express";
import { createPost, getAllPost, getSinglePost, searchPost, togglePostPublishedStatus } from "../controllers/post-controllers";
import { uploader } from "../middleware/uploader-middleware";

const router = express.Router();
const upload = uploader();

router.route("/").get(getAllPost).post(upload.single("images"), createPost);
router.route("/search").get(searchPost);
router.route("/:id").get(getSinglePost);
router.route("/:id/statistics");
router.route("/:id/published").put(togglePostPublishedStatus);

export default router;
