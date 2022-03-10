import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(result => result.data)
}

const addNew = newObject => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.post(baseUrl, newObject, config)
}


const blogService = { 
  getAll: getAll, 
  setToken: setToken,
  addNew: addNew
}

export default blogService