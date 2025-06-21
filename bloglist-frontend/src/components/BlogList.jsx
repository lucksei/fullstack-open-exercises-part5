import { useState, useEffect } from "react";
import blogService from "../services/blogs";

import Blog from "./Blog";
import AddBlogForm from "./AddBlogForm";
import Toggleable from "./Toggleable";

const BlogList = ({ user, setUser, handleAlert }) => {
  const [blogs, setBlogs] = useState([]);

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const refreshBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  useEffect(() => {
    refreshBlogs();
  }, []);

  const handleEditBlog = (editedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === editedBlog.id ? editedBlog : blog))
    );
  };

  return (
    <>
      <div>
        <span>{user.username} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Toggleable buttonLabel="new note">
        <AddBlogForm refreshBlogs={refreshBlogs} handleAlert={handleAlert} />
      </Toggleable>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} handleEditBlog={handleEditBlog} />
        ))}
      </div>
    </>
  );
};

export default BlogList;
