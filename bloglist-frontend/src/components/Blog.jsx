import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, refreshBlogs }) => {
  const [extended, setExtended] = useState(true);

  const toggleExtended = () => {
    setExtended(!extended);
  };

  const upvoteBlog = async () => {
    console.log("upvote");
    const response = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    });
    refreshBlogs();
  };

  const downvoteBlog = async () => {
    console.log("downvote");
    const response = await blogService.update({
      ...blog,
      likes: blog.likes - 1,
    });
    refreshBlogs();
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
