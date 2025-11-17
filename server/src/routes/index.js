import express from "express";
import { createPost, getPosts, allPost, updatePost, deletePost, toggleLike, toggleSave } from "../fetchers/post/index.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { centerNameList } from "../fetchers/user/index.js";
const router = express.Router();

router.post("/post/create", verifyToken, upload.single("image"), createPost);
router.get("/post/get", verifyToken, getPosts);
router.put("/post/update/:id", verifyToken, upload.single("image"), updatePost);
router.delete("/post/delete/:id", verifyToken, deletePost);
router.post("/post/like/:postId", verifyToken, toggleLike);
router.post("/post/save/:postId", verifyToken, toggleSave);
router.post("/allpost", allPost);
router.post("/centername/bypin", centerNameList);

export default router;
