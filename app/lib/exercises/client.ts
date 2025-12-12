import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTP_SERVER,
  withCredentials: true, 
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createExercise = async (exercise: any) => {
  const response = await api.post("/exercises", exercise);
  return response.data;
};

export const getExerciseById = async (id: string) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

export const getAllExercises = async () => {
  const response = await api.get("/exercises");
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateExercise = async (id: string, data: any) => {
  const response = await api.put(`/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id: string) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};
