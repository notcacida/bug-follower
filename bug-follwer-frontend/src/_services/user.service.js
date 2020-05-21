import { config } from '../../config.js'
import { authHeader } from '../_helpers'

const apiUrl = `${config.host}${config.port ? ':' + config.port : ''}`

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  addBug,
  delete: _delete
}

function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Basic dGVvQHRlc3QuY29tOmFzZGFzZGFzZA==',
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ email, password })
  }

  return fetch(
    `${apiUrl}/auth?access_token=${config.masterKey}`,
    requestOptions
  )
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user))

      return user
    })
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse)
}

function getAllBugs() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/bugs`, requestOptions).then(handleResponse)
}

function getById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/users/${id}`, requestOptions).then(handleResponse)
}

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }

  return fetch(
    `${apiUrl}/users?access_token=${config.masterKey}`,
    requestOptions
  ).then(handleResponse)
}

function addBug(bug) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }

  return fetch(`${apiUrl}/bugs`, requestOptions).then(handleResponse)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/bugs/${id}`, requestOptions).then(handleResponse)
}

function handleResponse(response) {
  console.log(response)
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        // logout()
        // location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
