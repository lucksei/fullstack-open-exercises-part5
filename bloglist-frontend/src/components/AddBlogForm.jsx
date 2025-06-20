import { useState } from "react";
import blogService from "../services/blogs";

const AddBlogForum = ({ refreshBlogs, handleAlert }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await blogService.create({
        title: title,
        author: author,
        url: url,
      });
      console.log(response);

      refreshBlogs();
      handleAlert("success", `A new blog! '${title}'`);
    } catch (exception) {
      handleAlert("error", "Could not create new blog entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AddBlogForum;
