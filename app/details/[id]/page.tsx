/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getExerciseDetails } from "@/app/lib/external/exerciseApi";
import { useUser } from "../../context/userContext";
import {
  getSavedByUser,
  removeSavedExercise,
  saveExercise,
} from "@/app/lib/saved/client";

export default function DetailsPage() {
  const { id } = useParams();
  const exerciseId = String(id);
  const { user } = useUser();

  const [exercise, setExercise] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      // 1️⃣ Load exercise details
      const ex = await getExerciseDetails(exerciseId);
      setExercise(ex);

      // 2️⃣ Check if saved (only if logged in)
      if (user) {
        const saved = await getSavedByUser(user._id);
        const exists = saved.some(
          (record: any) => record.exerciseId === exerciseId
        );
        setIsSaved(exists);
      }
    };

    load();
  }, [exerciseId, user]);

  const handleSave = async () => {
    if (!user) {
      alert("Please sign in to save exercises.");
      return;
    }

    try {
      await saveExercise(user._id, exerciseId);
      setIsSaved(true);
      setMessage("Exercise saved!");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage("Already saved");
      } else {
        setMessage("Error saving exercise");
      }
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await removeSavedExercise(user._id, exerciseId);
      setIsSaved(false);
      setMessage("Exercise removed from saved.");
    } catch {
      setMessage("Error removing exercise.");
    }
  };

  if (!exercise) {
    return <div className="p-10 text-center">Loading exercise…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

        <h1 className="text-4xl font-bold capitalize mb-4">
          {exercise.name}
        </h1>

        {exercise.gifUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full max-h-[400px] object-contain rounded-lg mb-6"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoBlock title="Target Muscles" items={exercise.targetMuscles} />
          <InfoBlock title="Secondary Muscles" items={exercise.secondaryMuscles} />
          <InfoBlock title="Body Part" items={exercise.bodyParts} />
          <InfoBlock title="Equipment" items={exercise.equipments} />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">How to Perform</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {exercise.instructions.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Save / Remove button */}
        {user && (
          <button
            onClick={isSaved ? handleDelete : handleSave}
            className={`px-5 py-2 rounded-lg text-white transition ${
              isSaved
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaved ? "Remove Exercise" : "Save Exercise"}
          </button>
        )}

        {message && (
          <p className="mt-3 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

/* Info block */
function InfoBlock({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-700 capitalize">{items.join(", ")}</p>
    </div>
  );
}
