import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loggedUser = res.data.user;
        setUser(loggedUser);

        // ✅ Fetch all blogs
        const blogsRes = await axios.get("http://localhost:5000/api/blogs");

        // ✅ Count only blogs created by this user
        const myBlogs = blogsRes.data.filter(
          (b) => b.user._id === loggedUser._id
        );

        setBlogCount(myBlogs.length);

      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white shadow rounded">
      <div className="flex flex-col items-center gap-4">
        <img
          src={user.profilePic || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>

        {/* ✅ Blog Count */}
        <p className="text-gray-600">
          <b>Total Blogs Posted:</b> {blogCount}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
