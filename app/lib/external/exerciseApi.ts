// app/lib/external/exerciseApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

/**
 * Base axios instance for ExerciseDB.
 * Docs: https://www.exercisedb.dev/docs
 *
 * Uses the public demo key by default ("exercisedb").
 * If you want, you can override with NEXT_PUBLIC_EXERCISEDB_KEY.
 */
const api = axios.create({
  baseURL: "https://www.exercisedb.dev/api/v1",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_EXERCISEDB_KEY ?? "exercisedb",
  },
});

// Very light type – fields are optional because API may evolve
export type ExternalExercise = {
  id?: string | number;
  name?: string;
  exerciseId?: string | number;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  gifUrl?: string;
  [key: string]: any;
};

/** Small helper to safely extract an array of exercises from API responses */
function extractList(res: any): ExternalExercise[] {
  const data = res?.data;
  if (Array.isArray(data)) return data as ExternalExercise[];
  if (Array.isArray(data?.data)) return data.data as ExternalExercise[];
  if (Array.isArray(data?.results)) return data.results as ExternalExercise[];
  if (Array.isArray(data?.exercises)) return data.exercises as ExternalExercise[];
  return [];
}

/** Safely extract a single exercise object */
function extractSingle(res: any): ExternalExercise {
  const data = res?.data;
  if (data?.exercise) return data.exercise as ExternalExercise;
  if (data?.data) return data.data as ExternalExercise;
  return (data as ExternalExercise) ?? {};
}

/**
 * SEARCH by text query (name / description etc.)
 * GET /api/v1/exercises/search?q=...
 */
export const searchExercises = async (query: string): Promise<ExternalExercise[]> => {
  if (!query.trim()) return [];
  const res = await api.get("/exercises/search", {
    params: {
      q: query,
      limit: 30,
      offset: 0,
      threshold: 0.3,
    },
  });
  return extractList(res);
};

/**
 * GET exercise details by ExerciseDB ID
 * GET /api/v1/exercises/{exerciseId}
 */
export const getExerciseDetails = async (id: string | number): Promise<ExternalExercise> => {
  const res = await api.get(`/exercises/${id}`);
  return extractSingle(res);
};

/**
 * Get exercises for a specific muscle group to show on the home page.
 * GET /api/v1/muscles/{muscleName}/exercises
 *
 * Example muscle names that should work:
 * "chest", "upper legs", "lower legs", "waist", "back", "shoulders"
 */
export const getExercisesByMuscle = async (
  muscleName: string,
  limit = 6
): Promise<ExternalExercise[]> => {
  const encoded = encodeURIComponent(muscleName);
  const res = await api.get(`/muscles/${encoded}/exercises`, {
    params: { limit },
  });
  const list = extractList(res);
  return list.slice(0, limit);
};
