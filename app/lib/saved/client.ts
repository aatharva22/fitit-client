import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTP_SERVER,
  withCredentials: true, 
});

export const saveExercise = async (userId: string, exerciseId: string) => {
  const response = await api.post("api/saved", { userId, exerciseId });
  return response.data;
};

export const getSavedByUser = async (userId: string) => {
  const response = await api.get(`api/saved/user/${userId}`);
  return response.data;
};

export const removeSavedExercise = async (userId: string, exerciseId: string) => {
  const response = await api.delete("api/saved", {
    data: { userId, exerciseId }
  });
  return response.data;
};
