import express from "express";
import Blog from "../model/Blog.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer"; 
import cloudinary from "../utils/cloudinary.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });


// Create Blog with image
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });
      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      title,
      content,
      image: imageUrl,
      user: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all blogs
router.get("/", async (req, res) => {
  try {
    
    const blogs = await Blog.find().populate("user", "name profilepic").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    
  }
});

// Get single blog
router.get("/:id", async (req, res) => {
  try {
    
    const blog = await Blog.findById(req.params.id).populate("user", "name profilePic");
    res.json(blog);
  } catch (error) {
    
  }
});

// Update blog
// Update blog
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user"); // populate user
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const isAuthor = blog.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin === true;

    if (!isAuthor && !isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog_images" });
      blog.image = result.secure_url;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Delete blog
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    console.log(blog);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const isAuthor = blog.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin === true;

    if (!isAuthor && !isAdmin) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Like/Unlike
router.put("/like/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // prevent crash if user is missing
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ success: true, likesCount: blog.likes.length });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
