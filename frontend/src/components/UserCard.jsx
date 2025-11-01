import React from "react";

export default function UserCard({ user }) {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden lg:block">
      <div className="flex flex-col items-center">
        <img
          src={user?.profilePic || "https://via.placeholder.com/100"}
          alt={user?.name}
          className="rounded-full w-24 h-24 mb-2"
        />
        <h2 className="font-bold text-lg">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </aside>
  );
}
