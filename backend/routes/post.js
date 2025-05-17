import express from "express";
import upload from "../utility/multer.js";
import { requireAuth } from "../middlewares/authorization.js";
import { handleGetPosts, handlePostUpload } from "../controllers/post.js";

const router = express.Router();

router.post(
  "/upload",
  requireAuth,
  upload.single("postImage"),
  handlePostUpload
);

// post method to pass users array in body
router.post("/get-posts", handleGetPosts);

export default router;
