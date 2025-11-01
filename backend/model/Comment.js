import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
