// src/pages/Login.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:2051/api/auth/login", {
        email,
        password,
      });

      if (res.data && res.data.success) {
        // After a successful login
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id); // Store user ID in local storage
        localStorage.setItem("username", res.data.user.username); // Store username in local storage
        toast.success(res.data.message);
        navigate("/upload");
      } else {
        const errorMessage = res.data.message || "Login failed";
        console.error("Error:", errorMessage);

        // Display specific toast messages for different error scenarios
        if (errorMessage.includes("Email and password are required")) {
          toast.error("Please enter email and password");
        } else if (errorMessage.includes("User not found")) {
          toast.error("User not found. Please register.");
        } else if (errorMessage.includes("Invalid password")) {
          toast.error("Invalid password. Please try again.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <div id="login-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} method="POST">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>
          Don't have an account?
          <Link to="/register" className="MovetoOther">
            {" "}
            Register
          </Link>
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
