import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="Name" className="p-2 border rounded"
          value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="p-2 border rounded"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="p-2 border rounded"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="file" accept="image/*"
          onChange={e => setProfilePic(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
