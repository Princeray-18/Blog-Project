import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const fetchData = async () => {
    if (!user?.isAdmin) return;

    try {
      setLoading(true);
      const [blogsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setBlogs(blogsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const deleteBlog = async (blogId) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete blog");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete user");
    }
  };

  if (!user?.isAdmin) {
    return <h2 className="text-center mt-10">Access Denied. Admins only.</h2>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Blogs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="border rounded shadow p-4 flex flex-col justify-between hover:shadow-lg transition"
               onClick={() => navigate(`/blog/${b._id}`)}
            >
              {b.image && (
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold text-lg">{b.title}</h3>
              <p className="text-sm text-gray-600 mb-2">By: {b.user?.name}</p>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => deleteBlog(b._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  Delete
                </button>
                {/* You can add edit button if needed */}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="border rounded shadow p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={u.profilePic || "https://via.placeholder.com/40"}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => deleteUser(u._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
