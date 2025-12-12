// app/home/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "../lib/users/client";
import { getSavedByUser } from "../lib/saved/client";
import {
  getExercisesByMuscle,
  type ExternalExercise,
  getExerciseDetails
} from "../lib/external/exerciseApi";
import { title } from "process";

// Small type for saved record from your backend
type SavedRecord = {
  _id: string;
  userId: string;
  exerciseId: string; // we store the external ExerciseDB ID here
};

type HomeSection = {
  title: string;
  muscle: string; // name sent to /muscles/{muscleName}/exercises
};

const HOME_SECTIONS = [
  {
    title: "Chest",
    type: "muscle",
    value: "pectorals",
  },
  {
    title: "Back",
    type: "muscle",
    value: "lats",
  },
  {
    title: "Shoulders",
    type: "muscle",
    value: "delts",
  },
  {
    title: "Quads",
    type: "muscle",
    value: "quads",
  },
  {
    title: "Core",
    type: "muscle",
    value: "abs",
  },
  {
    title: "Cardio",
    type: "equipment",
    value: "cardiovascular system",
  },{
    title: "Shins",
    type: "muscle",
    value: "shins",
  }
];


export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState<ExternalExercise[]>([]);
  const [sectionExercises, setSectionExercises] = useState<
    Record<string, ExternalExercise[]>
  >({});
  const [loadingSections, setLoadingSections] = useState(true);

  // Load logged-in user + saved exercises
  useEffect(() => {
  const loadUserAndSaved = async () => {
    try {
      // 1. Get logged-in user
      const u = await profile();
      setUser(u);

      // 2. Get saved records (userId + exerciseId)
      const savedRecords: SavedRecord[] = await getSavedByUser(u._id);

      // 3. Fetch full exercise details for each saved exercise
      const fullExercises: ExternalExercise[] = [];

      for (const record of savedRecords) {
        try {
          const exercise = await getExerciseDetails(record.exerciseId);
          fullExercises.push(exercise);
        } catch {
          // If one exercise fails, skip it safely
          console.warn("Failed to load exercise", record.exerciseId);
        }
      }

      // 4. Save hydrated exercises for UI
      setSaved(fullExercises);

    } catch {
      setUser(null);
      setSaved([]);
    }
  };

  loadUserAndSaved();
}, []);


  // Load category sections from ExerciseDB
  useEffect(() => {
  const loadSections = async () => {
    setLoadingSections(true);

    try {
      const result: Record<string, ExternalExercise[]> = {};

      // Go section by section (Chest, Back, etc.)
      for (const section of HOME_SECTIONS) {
        const exercises = await getExercisesByMuscle(section.value, 6);
        result[section.title] = exercises;
      }

      setSectionExercises(result);
      //console.log(result)
    } catch (error) {
      console.error("Error loading section exercises:", error);
      setSectionExercises({});
    } finally {
      setLoadingSections(false);
    }
  };

  loadSections();
}, []);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="text-center py-14">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
          Let’s Get Fit 💪
        </h1>

        {user && (
          <p className="text-gray-700 text-lg">
            Welcome back,{" "}
            <span className="font-semibold">{user.username}</span>!
          </p>
        )}

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-2">
          Explore workouts tailored for strength, endurance, and performance.
        </p>
      </section>

      {/* Search bar */}
      <section className="max-w-xl mx-auto px-6 mt-4 mb-8">
        <form
          className="flex items-center gap-3"
          action="/search"
          method="GET"
        >
          <input
            type="text"
            name="query"
            placeholder="Search exercises (e.g., push-up, squat, chest)…"
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Saved exercises preview (logged-in only) */}
      {user && (
        <section className="max-w-6xl mx-auto px-6 pb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Your Saved Exercises
          </h2>

          {saved.length === 0 ? (
            <p className="text-gray-600">
              You haven&apos;t saved any exercises yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {saved.slice(0, 9).map((record) => (
                  <ExerciseCard key={record.exerciseId} exercise={record} /> // g 
                ))}
              </div>

              <div className="mt-6 text-right">
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View All →
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      {/* Category sections from ExerciseDB */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        {HOME_SECTIONS.map((section) => (
          <div key={section.title} className="mt-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {section.title}
            </h2>

            {loadingSections && !sectionExercises[section.title] ? (
              <p className="text-gray-600">Loading exercises…</p>
            ) : sectionExercises[section.title]?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sectionExercises[section.title].map((exercise) => (
                  <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No exercises could be loaded for this section.
              </p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

/** Card for saved exercise – just shows a button linking to details */
function SavedCard({ exercise }: { exercise: ExternalExercise }) {
  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden flex flex-col">
      
      {/* Image */}
      <div className="w-full h-40 bg-gray-200">
        <img
          src={exercise.gifUrl}
          alt={exercise.name ?? "Exercise"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {exercise.name}
        </h3>

        <Link
          href={`/details/${exercise.exerciseId}`}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}


/** Generic card used for category sections */
function ExerciseCard({ exercise }: { exercise: ExternalExercise }) {
  const id = exercise.exerciseId ?? "";
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition border overflow-hidden flex flex-col">
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        {exercise.gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt={exercise.name ?? "Exercise"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No Image</span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {exercise.name ?? "Exercise"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {exercise.target ?? exercise.bodyPart ?? ""}
          </p>
        </div>

        <Link
          href={`/details/${id}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
