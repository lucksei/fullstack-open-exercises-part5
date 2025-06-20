import Blog from "./Blog";

const BlogList = ({ blogs, user, setUser }) => {
  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  return (
    <>
      <div>
        <span>{user.username} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </div>

      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default BlogList;
