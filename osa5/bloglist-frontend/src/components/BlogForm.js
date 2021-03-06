import React, { useState } from 'react'

const BlogForm = ({createBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  //const [notificationMessage, setNotificationMessage] = useState(null)

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    
    createBlog(blogObject)

    setUrl('')
    setTitle('')
    setAuthor('')

    //setNotificationMessage(`Added new blog ${title} by ${author}`)
    setTimeout(() => {
      //setNotificationMessage(null)
    }, 5000);

  }

  return (
    <div>
    <h2>create new</h2>

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

export default BlogForm