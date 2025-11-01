import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">My Blog</h2>
      <ul className="space-y-2">
        <li><a href="/" className="hover:text-blue-600">All Blogs</a></li>
        <li><a href="/create" className="hover:text-blue-600">Create Blog</a></li>
        <li><a href="/profile" className="hover:text-blue-600">Profile</a></li>
        <li><a href="/register" className="hover:text-blue-600">Register</a></li>
        <li><a href="/login" className="hover:text-blue-600">Login</a></li>
      </ul>
    </aside>
  );
}
