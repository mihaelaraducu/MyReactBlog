import axios from "axios";
import { API_URL } from "../config";
import type { User } from "../types/User";

export const getUsers = () => axios.get<{ data: User[] }>(`${API_URL}/users`);
export const getUser = (id: number) =>
  axios.get<{ data: User }>(`${API_URL}/users/${id}`);
export const createUser = (user: FormData) =>
  axios.post(`${API_URL}/users`, user);
export const updateUser = (id: number, user: FormData) =>
  axios.put(`${API_URL}/users/${id}`, user);
export const deleteUser = (id: number) =>
  axios.delete(`${API_URL}/users/${id}`);