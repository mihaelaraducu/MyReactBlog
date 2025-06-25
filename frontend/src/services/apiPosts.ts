import axios from "axios";
import { API_URL } from "../config";
import type { Post } from "../types/Post";

export const getPosts = () => axios.get<{ data: Post[] }>(`${API_URL}/posts`);
export const getPost = (id: number) =>
  axios.get<{ data: Post }>(`${API_URL}/posts/${id}`);
export const createPost = (post: FormData) =>
  axios.post(`${API_URL}/posts`, post);
export const updatePost = (id: number, post: FormData) =>
  axios.put(`${API_URL}/posts/${id}`, post);
export const deletePost = (id: number) =>
  axios.delete(`${API_URL}/posts/${id}`);