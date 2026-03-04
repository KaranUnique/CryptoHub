import React from 'react'
import { Link } from 'react-router-dom'
import "./PageNotFound.css"

const PageNotFound = () => {
  return (
    <div className='container'>
      <h1>404</h1>
      <p>Oops! Page Not Found</p>
      <Link className="back-home" to="/">Go back to Home</Link>
    </div>
  )
}

export default PageNotFound