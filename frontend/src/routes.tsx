import { Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import EditUser from "./components/EditUser";
import NotFound from "./pages/NotFound";
import PostList from "./pages/PostList";
import EditPost from "./components/EditPost";
import CreatePost from "./components/CreatePost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SinglePost from "./pages/SinglePost";
import Contact from "./pages/Contact";
import Posts from "./pages/Posts";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
// Adaugă și alte pagini după nevoie

export default function AppRoutes() {
  return (
   <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts" element={<Posts />} />
            <Route path="contact" element={<Contact />} />
            <Route path="post/:id" element={<SinglePost />} />
            <Route path="mylogin" element={<Login />} />
            <Route path="myregister" element={<Register />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path="view-users" element={<UserList />} />
            <Route path="add-post" element={<CreatePost />} />
            <Route path="edit-post/:id" element={<EditPost />} />
            <Route path="view-posts" element={<PostList />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
  );
}