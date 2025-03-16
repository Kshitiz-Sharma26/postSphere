import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
      default: [],
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;
