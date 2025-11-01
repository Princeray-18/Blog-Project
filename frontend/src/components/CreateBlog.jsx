import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Blog created successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="p-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
