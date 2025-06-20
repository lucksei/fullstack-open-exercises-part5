import { useState, useEffect } from "react";
import blogService from "./services/blogs";

import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Alert from "./components/Alert";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ hidden: true });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [setBlogs]);

  const handleAlert = (type, message) => {
    setAlert({ type: type, message: message, hidden: false });
    setTimeout(() => {
      setAlert({ ...alert, hidden: true });
    }, 5000);
  };

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
          <LoginForm user={user} setUser={setUser} handleAlert={handleAlert} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Alert
            type={alert.type}
            message={alert.message}
            hidden={alert.hidden}
          />
          <BlogList blogs={blogs} user={user} setUser={setUser} />
        </>
      )}
    </div>
  );
};

export default App;
