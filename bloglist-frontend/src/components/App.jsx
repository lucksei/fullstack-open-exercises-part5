import { useState, useEffect } from "react";
import blogService from "../services/blogs";

import BlogList from "./BlogList";
import AddBlogForm from "./AddBlogForm";
import LoginForm from "./LoginForm";
import Alert from "./Alert";

import "../app.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ hidden: true });

  const handleAlert = (type, message) => {
    setAlert({ type: type, message: message, hidden: false });
    setTimeout(() => {
      setAlert({ ...alert, hidden: true });
    }, 5000);
  };

  const handleSetUser = (user) => {
    blogService.setToken(user.token);
    setUser(user);
  };

  const refreshBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  useEffect(() => {
    refreshBlogs();
  }, [setBlogs]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      handleSetUser(user);
    }
  }, [setUser]);

  return (
    <div>
      {user === null ? (
        <>
          <h2>log in to application</h2>
          <Alert
            type={alert.type}
            message={alert.message}
            hidden={alert.hidden}
          />
          <LoginForm handleSetUser={handleSetUser} handleAlert={handleAlert} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Alert
            type={alert.type}
            message={alert.message}
            hidden={alert.hidden}
          />
          <BlogList
            blogs={blogs}
            user={user}
            setUser={setUser}
            refreshBlogs={refreshBlogs}
            handleAlert={handleAlert}
          />
        </>
      )}
    </div>
  );
};

export default App;
