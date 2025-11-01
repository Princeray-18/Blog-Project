import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext) || {};
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl">Zidio Blog</h1>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="px-3 py-1 border rounded">
            All Blogs
          </Link>
          {user && (
            <Link to="/create" className="px-3 py-1 border rounded">
              Create Blog
            </Link>
          )}
          {user && (
            <Link to="/profile" className="px-3 py-1 border rounded">
              Profile
            </Link>
          )}
          {!user && (
            <>
              <Link to="/register" className="px-3 py-1 border rounded">
                Register
              </Link>
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
            </>
          )}
          {user && (
            <button
              onClick={logoutUser}
              className="text-red-600 px-3 py-1 border rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          <Link
            to="/"
            className="px-3 py-1 border rounded mx-2"
            onClick={() => setOpen(false)}
          >
            All Blogs
          </Link>
          {user && (
            <>
              <Link
                to="/create"
                className="px-3 py-1 border rounded mx-2"
                onClick={() => setOpen(false)}
              >
                Create Blog
              </Link>
              <Link
                to="/profile"
                className="px-3 py-1 border rounded mx-2"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => { logoutUser(); setOpen(false); }}
                className="text-red-600 px-3 py-1 border rounded mx-2"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/register"
                className="px-3 py-1 border rounded mx-2"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-3 py-1 border rounded mx-2"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
