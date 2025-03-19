import Post from "../models/post.js";
import { uploadImageToCloudinary } from "../utility/cloudinary.js";
import fs from "fs";

export const handlePostUpload = async (req, resp) => {
  const { caption } = req.body;
  const { id } = req.user;
  const imagePath = req.file.path;
  let imageUrl;

  try {
    imageUrl = await uploadImageToCloudinary(imagePath);
    fs.unlinkSync(imagePath);

    await Post.create({
      caption,
      createdBy: id,
      image: imageUrl,
      comments: [],
      likes: [],
    });
    return resp.status(200).json({
      message: "Post uploaded successfully.",
    });
  } catch (err) {
    return resp.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const handleLikePost = async (req, resp) => {
  const { postId } = req.body;
  const { id: userId } = req.user;

  try {
    await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    return resp.status(200).json({
      message: "Post liked successfully.",
    });
  } catch (err) {
    return resp.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const handleUnlikePost = async (req, resp) => {
  const { postId } = req.body;
  const { id: userId } = req.user;

  try {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    return resp.status(200).json({
      message: "Post unliked successfully.",
    });
  } catch (err) {
    return resp.status(500).json({ message: "Internal server error." });
  }
};
