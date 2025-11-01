import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", content: "", image: "" });
  const [file, setFile] = useState(null);

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Use FormData to send file
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      if (file) formData.append("image", file);

      await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update blog");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          className="border p-2"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          placeholder="Title"
          required
        />
        <textarea
          className="border p-2 h-40"
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          placeholder="Content"
          required
        />

        {/* Current image preview */}
        {blog.image && (
          <img
            src={blog.image}
            alt="Current"
            className="w-full h-40 object-cover rounded"
          />
        )}

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
