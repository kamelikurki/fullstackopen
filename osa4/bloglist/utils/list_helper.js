const dummy = () => {
  
  return 1
}


const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {

  const reducer = (max, item) => {
    return Math.max(max, item.likes)
  }

  const mostLikes = blogs.reduce(reducer,0) 

  return blogs.find(blog => blog.likes === mostLikes)

}

const mostBlogs = (blogs) => {


  let names = []
  let counts = []


  blogs.forEach( (blog) => {

    if(names.includes(blog.author)) {
      counts[names.indexOf(blog.author)] += 1
    }
    else {
      names = names.concat(blog.author)
      counts = counts.concat(1)
    }
  })

  const maxIdx = counts.indexOf(Math.max(...counts))

  const output = {
    author: names[maxIdx],
    blogs: counts[maxIdx]
  }
  
  return output

}

const mostLikes = (blogs) => {

  let names = []
  let likes = []


  blogs.forEach( (blog) => {

    if(names.includes(blog.author)) {
      likes[names.indexOf(blog.author)] += blog.likes
    }
    else {
      names = names.concat(blog.author)
      likes = likes.concat(blog.likes)
    }
  })

  const maxIdx = likes.indexOf(Math.max(...likes))

  const output = {
    author: names[maxIdx],
    likes: likes[maxIdx]
  }
  
  return output
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}