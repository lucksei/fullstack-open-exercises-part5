import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  // Modify the blog user to only send its id
  blog.user = blog.user.id

  await axios.patch(`${baseUrl}/${blog.id}`, blog, config)
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

export default { getAll, setToken, create, update, remove }