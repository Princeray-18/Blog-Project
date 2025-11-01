import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
      setComments(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);

        const commentsRes = await axios.get(
          `http://localhost:5000/api/comments/${id}`
        );
        setComments(commentsRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async (e) => {
    e.preventDefault(); // make sure button click doesn't refresh page
    if (!user) return alert("Login to like");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update likes array in state
      setBlog((prev) => {
        const alreadyLiked = prev.likes.includes(user._id);
        const updatedLikes = alreadyLiked
          ? prev.likes.filter((uid) => uid !== user._id)
          : [...prev.likes, user._id];
        return { ...prev, likes: updatedLikes };
      });
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Login to like");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText("");
      fetchComments();
    } catch (e) {
      alert("Login to comment");
    }
  };

  const deleteBlog = async () => {
    if (!confirm("Delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (e) {
      alert(e.response?.data?.message || "Cannot delete");
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (e) {
      alert("Cannot delete comment");
    }
  };

  if (!blog) return <div className="p-6">Loading...</div>;

  const liked = user && blog.likes?.some((id) => id === user._id);

  return (
    <div className="container mx-auto py-6 px-4 flex gap-6">
      <div className="w-64 hidden md:block">
        {/* left sidebar could be reused */}
      </div>

      <article className="flex-1 bg-white p-6 rounded shadow">
        {blog.image && (
          <img
            src={blog.image}
            className="w-full h-64 object-cover rounded mb-4"
            alt={blog.title}
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={blog.user?.profilePic || "https://via.placeholder.com/40"}
            className="w-10 h-10 rounded-full"
            alt="author"
          />
          <div>
            <div className="font-semibold">{blog.user?.name}</div>
            <div className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="prose max-w-none mb-4">{blog.content}</div>

        <div className="flex gap-3 items-center mb-4">
          <button
            onClick={handleLike}
            type="button" // VERY IMPORTANT: prevent form submit
            className="px-3 py-1 border rounded"
          >
            {blog.likes?.length || 0} {"❤️likes"}
          </button>

          {user && blog.user && (user._id === blog.user._id  || user.isAdmin==true)&& (
            <>
              <Link
                to={`/edit/${blog._id}`}
                className="px-3 py-1 border rounded"
              >
                Edit
              </Link>
              <button
                onClick={deleteBlog}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>

        <section>
          <h3 className="font-semibold mb-2">Comments ({comments.length})</h3>
          {user ? (
            <form onSubmit={addComment} className="flex gap-2 mb-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Write a comment..."
                required
              />
              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                Post
              </button>
            </form>
          ) : (
            <div className="mb-4">
              Please{" "}
              <Link to="/login" className="text-blue-600">
                login
              </Link>{" "}
              to comment.
            </div>
          )}

          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c._id}
                className="p-3 border rounded flex justify-between"
              >
                <div>
                  <div className="font-semibold">{c.author?.name}</div>
                  <div className="text-sm text-gray-700">{c.content}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
                {user && c.author && user._id === c.author._id && (
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </article>

      <aside className="w-64 hidden lg:block">
        {/* user card or other widgets */}
      </aside>
    </div>
  );
}
