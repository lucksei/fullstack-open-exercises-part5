import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, handleEditBlog }) => {
  const [extended, setExtended] = useState(true);

  const toggleExtended = () => {
    setExtended(!extended);
  };

  const upvoteBlog = async () => {
    await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    });
    handleEditBlog({ ...blog, likes: blog.likes + 1 });
  };

  const downvoteBlog = async () => {
    await blogService.update({
      ...blog,
      likes: blog.likes - 1,
    });
    handleEditBlog({ ...blog, likes: blog.likes - 1 });
  };

  return (
    <>
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleExtended}>{extended ? "show" : "hide"}</button>
        <div style={{ display: extended ? "none" : "" }}>
          <div>{blog.url}</div>{" "}
          <div>
            likes {blog.likes}
            <button onClick={upvoteBlog}>▲</button>
            <button onClick={downvoteBlog}>▼</button>
          </div>
          <div>{blog.user.username}</div>
        </div>
      </div>
    </>
  );
};

export default Blog;
