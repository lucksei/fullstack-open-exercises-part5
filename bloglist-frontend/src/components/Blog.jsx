import { useState } from 'react';

const Blog = ({ blog, handleEditBlog, handleDeleteBlog, showDeleteButton }) => {
  const [extended, setExtended] = useState(true);

  const toggleExtended = () => {
    setExtended(!extended);
  };

  return (
    <>
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleExtended} className="btn-toggle-show">
          {extended ? 'show' : 'hide'}
        </button>
        <div style={{ display: extended ? 'none' : '' }}>
          <a href={blog.url} className="url">
            {blog.url}
          </a>{' '}
          <div className="likes">
            likes {blog.likes}
            <button
              className="btn-like"
              onClick={() => handleEditBlog({ ...blog, likes: blog.likes + 1 })}
            >
              ▲
            </button>
            <button
              className="btn-dislike"
              onClick={() => handleEditBlog({ ...blog, likes: blog.likes - 1 })}
            >
              ▼
            </button>
          </div>
          <div>{blog.user.username}</div>
          {showDeleteButton ? (
            <button type="button" onClick={() => handleDeleteBlog(blog)}>
              delete
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Blog;
