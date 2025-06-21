import { useState } from "react";

const Blog = ({ blog }) => {
  const [extended, setExtended] = useState(true);

  const toggleExtended = () => {
    setExtended(!extended);
  };

  return (
    <>
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleExtended}>{extended ? "show" : "hide"}</button>
        <div style={{ display: extended ? "none" : "" }}>
          <div>{blog.url}</div> <div>likes {blog.likes}</div>
          <div>{blog.user.username}</div>
        </div>
      </div>
    </>
  );
};

export default Blog;
