const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  event: { type: String, required: true },
  destination: { type: String, required: true },
  imageUrl: { type: String },
  spotifyEmbedUrl: { type: String },
  email: { type: String },
  authorName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
