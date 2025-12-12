/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { profile, updateProfile } from "../lib/users/client";
import { getSavedByUser } from "../lib/saved/client";
import {
  getExerciseDetails,
  type ExternalExercise,
} from "../lib/external/exerciseApi";

/* ---------- Types ---------- */

type SavedRecord = {
  _id: string;
  userId: string;
  exerciseId: string;
};

type HydratedSaved = {
  recordId: string;
  exerciseId: string;
  exercise: ExternalExercise | null;
};

/* ---------- Page ---------- */

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState<HydratedSaved[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        /* 1️⃣ Load logged-in user */
        const currentUser = await profile();
        setUser(currentUser);

        setForm({
          name: currentUser.name ?? "",
          age: currentUser.age ?? "",
          height: currentUser.height ?? "",
          weight: currentUser.weight ?? "",
          gender: currentUser.gender ?? "",
        });

        /* 2️⃣ Load saved exercise records */
        const savedRecords: SavedRecord[] = await getSavedByUser(
          currentUser._id
        );

        /* 3️⃣ Hydrate with ExerciseDB */
        const hydrated: HydratedSaved[] = [];

        for (const record of savedRecords) {
          try {
            const exercise = await getExerciseDetails(record.exerciseId);
            hydrated.push({
              recordId: record._id,
              exerciseId: record.exerciseId,
              exercise,
            });
          } catch {
            hydrated.push({
              recordId: record._id,
              exerciseId: record.exerciseId,
              exercise: null,
            });
          }
        }

        setSaved(hydrated);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleUpdate = async () => {
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile…</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">

      {/* ---------- User Info ---------- */}
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* ---------- Profile Form ---------- */}
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={(v: any) => setForm({ ...form, name: v })} />
          <Input label="Age" value={form.age} onChange={(v: any) => setForm({ ...form, age: v })} />
          <Input label="Height (cm)" value={form.height} onChange={(v: any) => setForm({ ...form, height: v })} />
          <Input label="Weight (kg)" value={form.weight} onChange={(v: any) => setForm({ ...form, weight: v })} />

          <select
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
            className="border p-2 rounded text-black"
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>

      {/* ---------- Saved Exercises ---------- */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Saved Exercises</h2>

        {saved.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t saved any exercises yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {saved.map(item => (
              <ExerciseCard
                key={item.recordId}
                exerciseId={item.exerciseId}
                exercise={item.exercise}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border p-2 rounded text-black"
      />
    </div>
  );
}

function ExerciseCard({
  exerciseId,
  exercise,
}: {
  exerciseId: string;
  exercise: ExternalExercise | null;
}) {
  const name = exercise?.name ?? `Exercise ${exerciseId}`;
  const target =
    exercise?.targetMuscles?.[0] ??
    exercise?.bodyParts?.[0] ??
    "Unknown";

  const gifUrl = exercise?.gifUrl;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition border p-4">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
        {gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gifUrl}
            alt={name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500 text-sm">No image</span>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-3">{name}</h3>
      <p className="text-gray-600 text-sm">{target}</p>

      <Link
        href={`/details/${exerciseId}`}
        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Details
      </Link>
    </div>
  );
}
