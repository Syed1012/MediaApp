// /server/server.js

// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Media from "./models/Media.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import verifyToken from "./middleware/verifyToken.js";

// Configure env
dotenv.config();

// Database config [connection]
connectDB();

// Rest object
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage for session-specific media data
let sessionMediaData = [];


app.get("/", (req, res)=>{
  res.send("It's working");
})


// Route to handle media uploads
app.post("/upload", verifyToken, async (req, res) => {
  const { title, description, thumbnailUrl, videoUrl } = req.body;
  const userId = req.user._id; // Extract user ID from the token

  console.log("User ID:", userId);

  // Assuming you have a Media model
  const media = new Media({
    title,
    description,
    imageURL: thumbnailUrl,
    videoURL: videoUrl,
    user: userId, // Associate the uploaded media with the user
  });

  try {
    // Save media to MongoDB
    await media.save();

    // Add the uploaded media to the session data
    sessionMediaData.push({
      _id: media._id,
      title,
      description,
      imageURL: thumbnailUrl,
      videoURL: videoUrl,
      user: userId, // Include user ID in session data
    });

    res
      .status(201)
      .json({ message: "Media uploaded and data saved successfully" });
  } catch (error) {
    console.error("Error saving data to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to fetch session-specific media data
app.get("/media", (req, res) => {
  res.status(200).json(sessionMediaData);
});

// User registration and login routes
app.use("/api/auth", authRoutes);

// Port
const PORT = 5010;

// Listen to the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});