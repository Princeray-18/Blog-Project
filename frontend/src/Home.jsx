import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import BlogCard from "./components/BlogCard";
import UserCard from "./components/UserCard";

export default function Home(){
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=> {
    (async ()=> {
      try {
        // ✅ fetch blogs
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);

        // ✅ fetch logged-in user
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userRes.data.user);
        }

      } catch (err) { console.log(err); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex gap-4 py-6">
        <Sidebar />

        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
        </main>

        {/* ✅ pass user here */}
        <UserCard user={user} />
      </div>
    </div>
  );
}
