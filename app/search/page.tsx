// app/search/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  searchExercises,
  type ExternalExercise,
} from "../lib/external/exerciseApi";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("query") ?? "";

  const [results, setResults] = useState<ExternalExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const data = await searchExercises(query);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Results for &quot;{query}&quot;
      </h1>

      {loading ? (
        <p>Loading…</p>
      ) : results.length === 0 ? (
        <p className="text-gray-600">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: ExternalExercise }) {
  const id = exercise.exerciseId ?? "";
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition border p-4 flex flex-col">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
        {exercise.gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt={exercise.name ?? "Exercise"}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500 text-sm">No image</span>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-3">
        {exercise.name ?? "Exercise"}
      </h3>
      <p className="text-gray-600 text-sm">
        {exercise.target ?? exercise.bodyPart ?? ""}
      </p>

      <Link
        href={`/details/${id}`}
        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Details
      </Link>
    </div>
  );
}
