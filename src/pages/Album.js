// ./src/pages/Album.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../layout/CardComponent";
import { useNavigate } from "react-router-dom";
import "../styles/album.css";

function Album() {
  const navigate = useNavigate();
  const [mediaData, setMediaData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Use effect to check login status whenever it changes
  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Remove isLoggedIn from the dependency array

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token here
        const response = await axios.get("http://localhost:2051/media", {
          headers: {
            Authorization: token,
          },
        });
        setMediaData(response.data);
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    };
  
    fetchMediaData();
  }, []);

  const handleBtnClick = () => {
    navigate("/");
  };

  return (
    <div className="cardApp">
      {/* Conditionally render based on whether the user is logged in */}
      {isLoggedIn ? (
        // If user is logged in, render the media data
        mediaData.map((media) => (
          <React.Fragment key={media._id}>
            {/* Card for image */}
            <CardComponent
              imgSrc={media.imageURL}
              imgAlt="Card Image"
              title={media.title}
              description={media.description}
            />
            {/* Card for video */}
            <div className="video-card">
              <video controls>
                <source src={media.videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-info">
                <h3>{media.title}</h3>
                <p>{media.description}</p>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        // If user is not logged in, show a message
        <div className="not-logged-in-message">
          <h2>You are not logged in</h2>
          <p>Please log in to access this content.</p>
          {/* You can add a login button or link here */}
          <button className="btnclick" onClick={handleBtnClick}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Album;
