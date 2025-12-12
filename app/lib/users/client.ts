/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER ?? "https://fitit-backend.onrender.com";
// export const HTTP_SERVER =  "http://localhost:4000"
const api = axios.create({
  baseURL: HTTP_SERVER,
  withCredentials: true, 
});

export const signin = async (credentials: any) => {
  const response = await api.post("/api/users/signin", credentials);
  return response.data;
};

export const signup = async (user: any) => {
  const response = await api.post("/api/users/signup", user);
  return response.data;
};



export const signout = async () => {
  const response = await api.post("/api/users/signout");
  return response.data;
};

export const profile = async () => {
  const response = await api.get("/api/users/profile");
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await api.put(`/api/users/${user._id}`, user);
  return response.data;
};

export const updateProfile = async (updates: any) => {
  const response = await api.put(
    `/api/users/profile`,
    updates
  );
  return response.data;
};


