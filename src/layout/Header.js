// ./src/layout/Header.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to={"/"} className="nav-lik">
          <h1>MediaHub</h1>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to={"/upload"} className="nav-link">
          Upload
        </Link>
        <Link to={"/album"} className="nav-link">
          Albums
        </Link>
        {isLoggedIn ? (
          <>
            <Link to={"/"} className="nav-link" onClick={handleLogout}>
              Logout
            </Link>
            <div>
              <span className="username">{username}</span>
              <i className="fa fa-user"></i>
            </div>
          </>
        ) : (
          <>
            <Link to={"/"} className="nav-link">
              Login
            </Link>
            <Link to={"/register"} className="nav-link">
              Register
            </Link>
            <Link to={"#"} className="nav-link">
              Profile
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
