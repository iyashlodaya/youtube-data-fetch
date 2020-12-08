const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  id: String,
  playlistTitle: String,
  playlistDescription: String,
  playlistThumbnail: String,
  videoCount: Number,
});

module.exports = mongoose.model("Playlist", playlistSchema);
