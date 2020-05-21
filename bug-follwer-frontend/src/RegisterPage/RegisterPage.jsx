import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { userActions } from '../_actions'

function RegisterPage() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const registering = useSelector(state => state.registration.registering)
  const dispatch = useDispatch()

  // reset login status
  useEffect(() => {
    dispatch(userActions.logout())
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setUser(user => ({ ...user, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    setSubmitted(true)
    if (user.email && user.password) {
      dispatch(userActions.register(user))
    }
  }

  return (
    <div className="col-lg-8 offset-lg-2">
      <h2>Register</h2>
      <form name="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={
              'form-control' + (submitted && !user.email ? ' is-invalid' : '')
            }
          />
          {submitted && !user.username && (
            <div className="invalid-feedback">Username is required</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className={
              'form-control' +
              (submitted && !user.password ? ' is-invalid' : '')
            }
          />
        </div>
        <div className="form-group">
            <input type="radio" id="tester" value="tester"></input>
            <label for="tester">Tester</label>
            <input type="radio" id="developer" value="developer"></input>
            <label for="developer">Developer</label>
        </div>
        <div className="form-group">
          <button className="btn btn-primary">
            {registering && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Register
          </button>
          <Link to="/login" className="btn btn-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export { RegisterPage }
