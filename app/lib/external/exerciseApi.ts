// app/lib/external/exerciseApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";


const api = axios.create({
  baseURL: "https://www.exercisedb.dev/api/v1",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_EXERCISEDB_KEY ?? "exercisedb",
  },
});


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


function extractList(res: any): ExternalExercise[] {
  const data = res?.data;
  if (Array.isArray(data)) return data as ExternalExercise[];
  if (Array.isArray(data?.data)) return data.data as ExternalExercise[];
  if (Array.isArray(data?.results)) return data.results as ExternalExercise[];
  if (Array.isArray(data?.exercises)) return data.exercises as ExternalExercise[];
  return [];
}


function extractSingle(res: any): ExternalExercise {
  const data = res?.data;
  if (data?.exercise) return data.exercise as ExternalExercise;
  if (data?.data) return data.data as ExternalExercise;
  return (data as ExternalExercise) ?? {};
}


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


export const getExerciseDetails = async (id: string | number): Promise<ExternalExercise> => {
  const res = await api.get(`/exercises/${id}`);
  return extractSingle(res);
};


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
