import Blog from "./Blog";
import AddBlogForm from "./AddBlogForm";
import Toggleable from "./Toggleable";

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
      <br />
      <Toggleable buttonLabel="new note">
        <AddBlogForm refreshBlogs={refreshBlogs} handleAlert={handleAlert} />
      </Toggleable>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  );
};

export default BlogList;
