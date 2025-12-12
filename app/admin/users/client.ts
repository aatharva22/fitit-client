/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/admin",
  withCredentials: true,
});

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const createUser = async (user: any) => {
  const res = await api.post("/users", user);
  return res.data;
};

export const updateUser = async (id: string, user: any) => {
  await api.put(`/users/${id}`, user);
};

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};
