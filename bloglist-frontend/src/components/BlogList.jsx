import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import blogService from '../services/blogs';

import Blog from './Blog';
import AddBlogForm from './AddBlogForm';
import Toggleable from './Toggleable';

const sortBlogsByLikes = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes);
};

const BlogList = ({ user, setUser, handleAlert }) => {
  const [blogs, setBlogs] = useState([]);

  const toggleRef = useRef();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(sortBlogsByLikes(blogs));
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const handleAddBlog = (newBlog) => {
    setBlogs(sortBlogsByLikes(blogs.concat(newBlog)));
    toggleRef.current.toggleVisibility();
  };

  const handleEditBlog = (editedBlog) => {
    setBlogs(
      sortBlogsByLikes(
        blogs.map((blog) => (blog.id === editedBlog.id ? editedBlog : blog))
      )
    );
  };

  const handleDeleteBlog = (deleteBlog) => {
    setBlogs(blogs.filter((blog) => blog.id !== deleteBlog.id));
  };

  return (
    <>
      <div>
        <span>{user.username} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Toggleable buttonLabel="new note" ref={toggleRef}>
        <AddBlogForm handleAddBlog={handleAddBlog} handleAlert={handleAlert} />
      </Toggleable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleEditBlog={handleEditBlog}
            handleDeleteBlog={handleDeleteBlog}
          />
        ))}
      </div>
    </>
  );
};

BlogList.propTypes = {
  user: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  handleAlert: PropTypes.func.isRequired,
};

export default BlogList;
