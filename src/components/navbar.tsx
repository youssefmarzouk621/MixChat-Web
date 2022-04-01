import React from 'react'

function Navbar() {
  return (
    <nav className="navbar navbar-light Mixchat-nav">
    <div className="container">
      <a className="navbar-brand" href="/">
        <img src="./assets/bootstrap-logo.svg" alt="" width="30" height="24" />
      </a>

      <div className="dropdown">  
            <a href="/" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="./assets/img/youssef.jpeg" alt="" width="32" height="32" className="rounded-circle me-2" />
              <strong>Youssef Marzouk</strong>
            </a>
            <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
              <li><a className="dropdown-item" href="/">Settings</a></li>
              <li><a className="dropdown-item" href="/">Profile</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/">Sign out</a></li>
            </ul>
          </div>
    </div>
  </nav>
  )
}

export default Navbar