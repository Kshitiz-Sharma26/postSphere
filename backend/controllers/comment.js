import Comment from "../models/comment";

export const handleAddComment = async (req, resp) => {
  const { id: userId } = req.user;
  const { postId, content } = req.body;

  try {
    await Comment.create({
      content,
      post: postId,
      createdBy: userId,
    });
    resp.status(200).json({
      message: "Comment added successfully.",
    });
  } catch (err) {
    resp.status(500).json({
      mmessage: "Internal server error.",
    });
  }
};
