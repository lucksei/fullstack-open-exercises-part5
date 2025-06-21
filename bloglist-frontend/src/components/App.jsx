import { useState, useEffect } from 'react';
import blogService from '../services/blogs';

import BlogList from './BlogList';
import LoginForm from './LoginForm';
import Alert from './Alert';

import '../app.css';

const App = () => {
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
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
          <BlogList user={user} setUser={setUser} handleAlert={handleAlert} />
        </>
      )}
    </div>
  );
};

export default App;
