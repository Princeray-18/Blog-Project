import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }){
  return (
    <div className="flex flex-col border rounded overflow-hidden bg-white max-h-[420px]">
      {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold truncate">{blog.title}</h3>
        <p className="text-sm text-gray-600 flex-1 mt-2">
          {blog.content.length > 180 ? blog.content.substring(0,180) + "..." : blog.content}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">by {blog.user?.name}</div>
          <Link to={`/blog/${blog._id}`} className="text-blue-600">Read</Link>
        </div>
      </div>
    </div>
  );
}
