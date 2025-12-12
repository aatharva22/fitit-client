/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../lib/users/client";
import { useUser } from "../context/userContext";

export default function RegisterPage() {
  const router = useRouter();

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {setUser} = useUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signup({ username, email, password });
      console.log("User registered:", user);
      setUser(user);
      router.push("/profile");

    } catch (err: any) {
      setError("User already exists or invalid data");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Create Account
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              required
              placeholder="johndoe"
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Sign In
          </a>
        </p>

      </div>
    </div>
  );
}
