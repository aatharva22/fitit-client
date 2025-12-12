"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  searchExercises,
  type ExternalExercise,
} from "../lib/external/exerciseApi";

export default function SearchClient() {
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
      } catch {
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
            <div key={exercise.exerciseId} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{exercise.name}</h3>
              <Link
                href={`/details/${exercise.exerciseId}`}
                className="text-blue-600 underline"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
