import express from "express";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// REGISTER
router.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Upload profile image to Cloudinary if exists
    let profileUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_profiles"
      });
      profileUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profileUrl
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    
  }
});


export default router;
