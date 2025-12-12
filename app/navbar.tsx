/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {  signout } from "../app/lib/users/client";
import { useRouter } from "next/navigation";
import { useUser } from "./context/userContext";

export default function Navbar() {
  const router = useRouter();

  const {user, setUser} = useUser()

  

  const handleSignOut = async () => {
    await signout();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left Side: Logo */}
      <Link href="/home" className="text-2xl font-bold text-blue-600">
        FitIt
      </Link>

      {/* Right Side: Buttons */}
      <div className="flex items-center space-x-4">

        {!user ? (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition"
            >
              {user.username}s Profile
            </Link>
            {user?.role === "admin" && (
            <Link href="/admin/users" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
            Admin-Controls
            </Link>
            )}


            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </>
        )}

      </div>
    </nav>
  );
}
