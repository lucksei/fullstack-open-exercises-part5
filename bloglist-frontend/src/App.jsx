import { useState, useEffect } from "react";
import blogService from "./services/blogs";

import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [setBlogs]);

  return (
    <div>
      {user === null ? (
        <LoginForm user={user} setUser={setUser} />
      ) : (
        <BlogList blogs={blogs} user={user} setUser={setUser} />
      )}
    </div>
  );
};

export default App;
