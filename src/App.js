// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Upload from "./pages/Upload.js";
import Album from "./pages/Album.js";
import Login from './pages/Login';
import Register from "./pages/Register.js";
import Header from './layout/Header.js';
import CardComponent from './layout/CardComponent';

function App() {
  return (
    <React.Fragment>
    <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/header" element={<Header />} />
        <Route path="/cardcomponent" element={<CardComponent />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/album" element={<Album />} />
      </Routes>
      <Toaster />
    </React.Fragment>
  );
}

export default App;