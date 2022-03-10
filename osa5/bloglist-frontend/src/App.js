import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'



const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(()  => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      blogService.getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })

    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }


  }

  const loginForm = () =>{ return (
    <div> 
      <h2>Login</h2>
      <Error message={errorMessage} />
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
  )
  }

  const addBlog = async (event) => {
    event.preventDefault()
    console.log('Adding blog')

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    await blogService.addNew(blogObject)
    let newBlogs  = await blogService.getAll()
    setBlogs(newBlogs)
    setUrl('')
    setTitle('')
    setAuthor('')

    setNotificationMessage(`Added new blog ${title} by ${author}`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000);

  }

  const logout = () =>
  {
    window.localStorage.clear()
    setUser(null)
  }

  const UserInfo = () => {
    return(
      <p>Welcome {user.name} <button onClick={logout}>logout</button>  </p>
    )
  }

  const blogForm = () => {
    return (
      <div>
      <form onSubmit={addBlog}>

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
      </div>
    )
  } 

  const blogInfo = () => {
    return (
      <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <UserInfo/>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    )
  }

  return (
    <>
    <h1>Bloglist</h1>
    {user === null && loginForm()}
    {user !== null && blogInfo()}
    </>
  )

  /*
  return (

  )*/
}

export default App