// ./server/models/Media.js
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  videoURL: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who uploaded the media
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;