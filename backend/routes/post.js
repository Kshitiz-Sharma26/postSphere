import express from "express";
import upload from "../utility/multer.js";
import { requireAuth } from "../middlewares/authorization.js";
import { handlePostUpload } from "../controllers/post.js";

const router = express.Router();

router.post(
  "/upload",
  requireAuth,
  upload.single("postImage"),
  handlePostUpload
);

export default router;
