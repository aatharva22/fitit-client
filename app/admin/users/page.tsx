/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // Load all users
  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
  const load = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  load();
}, []);


  // Create new user
  const handleCreate = async () => {
    try {
      await createUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin – User Management</h1>

      {/* CREATE USER */}
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-3">Create User</h2>

        <div className="flex flex-wrap gap-2">
          <input
            className="text-black px-2 py-1 border rounded"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />

          <input
            className="text-black px-2 py-1 border rounded"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />

          <input
            className="text-black px-2 py-1 border rounded"
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <select
            className="text-black px-2 py-1 border rounded"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleCreate}
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>

      {/* USER LIST */}
      <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  className="text-black px-2 py-1 border rounded"
                  value={u.role}
                  onChange={async (e) => {
                    await updateUser(u._id, { role: e.target.value });
                    loadUsers();
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={async () => {
                    await deleteUser(u._id);
                    loadUsers();
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
