import toast from "react-hot-toast";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/upload.css";

function Upload({ onMediaUpload }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [errorToastShown, setErrorToastShown] = useState(false);

  // Use useEffect to check if the user is logged in
  const isLoggedIn = localStorage.getItem("token");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const getUserIdFromLocalStorage = () => {
    // Implement this function to retrieve the user's ID from local storage or context
    return localStorage.getItem("userId"); // Example: return localStorage.getItem("userId");
  };

  const uploadMedia = async () => {
    if (!title || !description || !thumbnail || !video) {
      toast.error("Please fill in all the fields");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = getUserIdFromLocalStorage(); // Retrieve user ID from local storage

    // Debug: Log user ID
    // console.log("User ID:", userId);

    // Set up headers with the token for authentication
    const headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };

    if (!isLoggedIn && !errorToastShown) {
      toast.error("Please Login to Upload");
      setErrorToastShown(true);
      navigate("/");
      return; // Prevent further execution
    }

    const thumbnailData = new FormData();
    thumbnailData.append("file", thumbnail);
    thumbnailData.append("upload_preset", "Media_Hub");
    thumbnailData.append("cloud_name", "da5gwhx7p");

    const videoData = new FormData();
    videoData.append("file", video);
    videoData.append("upload_preset", "Media_Hub");
    videoData.append("cloud_name", "da5gwhx7p");

    try {
      const thumbnailResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/da5gwhx7p/image/upload",
        thumbnailData
      );
      const thumbnailUrl = thumbnailResponse.data.url;

      const videoResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/da5gwhx7p/video/upload",
        videoData
      );
      const videoUrl = videoResponse.data.url;

      // To Debug .. use these
      console.log("Thumbnail URL:", thumbnailUrl);
      console.log("Video URL:", videoUrl);

      saveToDatabase(title, description, thumbnailUrl, videoUrl, userId, headers); // Pass userId as parameter
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Error uploading media");
    }
  };

  const saveToDatabase = async (
    title,
    description,
    thumbnailUrl,
    videoUrl,
    userId,
    headers
  ) => {
    // Receive headers as parameter
    try {
      await axios.post(
        "https://media-app-api.vercel.app/upload",
        {
          title,
          description,
          thumbnailUrl,
          videoUrl,
          userId, // Include the user's ID in the data sent to the server
        },
        {
          headers,
        }
      );

      // Reset the state variables to clear the input fields
      setTitle("");
      setDescription("");
      setThumbnail(null);
      setVideo(null);

      toast.success("Media uploaded and data saved successfully");
      navigate("/upload");
    } catch (error) {
      console.error("Error saving data to the database:", error);
      toast.error("Error saving data to the database");
    }
  };

  return (
    <div className="App">
      <div className="App-content">
        <div className="form-container">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            maxLength="50"
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            maxLength="200"
          />

          <label htmlFor="thumbnail">Upload Thumbnail Image:</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/jpeg, image/png"
            onChange={handleThumbnailChange}
          />

          <label htmlFor="video">Upload Video:</label>
          <input
            type="file"
            id="video"
            accept="video/mp4, video/avi, video/mpeg"
            onChange={handleVideoChange}
          />

          <button className="Uploadbutton" onClick={uploadMedia}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;