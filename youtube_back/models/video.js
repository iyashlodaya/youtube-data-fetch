const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoId: String,
  videoTitle: String,
  videoDiscription: String,
  videoUrl: String,
  videoDuration: String,
  videoThumbnail: String,
});

module.exports = mongoose.model("Video", videoSchema);
