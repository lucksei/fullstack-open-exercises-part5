import Blog from "./Blog";
import AddBlogForm from "./AddBlogForm";

const BlogList = ({ blogs, user, setUser, refreshBlogs, handleAlert }) => {
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
      <h3>create new</h3>
      <AddBlogForm refreshBlogs={refreshBlogs} handleAlert={handleAlert} />
      <br />
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default BlogList;
