import express from "express";
import Comment from "../model/Comment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add comment
router.post("/:blogId", protect, async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.create({ content, blog: req.params.blogId, author: req.user._id });
  res.json(comment);
});

// Get comments
router.get("/:blogId", async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId }).populate("author", "name").sort({ createdAt: -1 });
  res.json(comments);
});

// Delete comment
router.delete("/:id", protect, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
});

export default router;
