import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/admin.js";
import User from "../model/User.js";
import Blog from "../model/Blog.js";

const router = express.Router();

// Get all users
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all blogs
router.get("/blogs", protect, async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/users/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete blog
router.delete("/blogs/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
