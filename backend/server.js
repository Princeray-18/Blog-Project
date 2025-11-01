import express from "express";
import dotenv from "dotenv";  
dotenv.config();
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import commentRoutes from "./routes/comment.js";
import adminRoutes from "./routes/admin.js"
import cors from "cors"; 
     
const app = express();
app.use(cors());
app.use(express.json());
 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/admin",adminRoutes)

app.listen(process.env.PORT || 5000, () => console.log("Server running on port 5000"));
        