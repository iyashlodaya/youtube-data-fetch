const mongoose = require("mongoose");

const sheetSchema = new mongoose.Schema({
  Title: String,
  Level: String,
  Language: String,
  Instructor: String,
  Quality: String,
  Category: String,
  Subcategory: String,
  Subject: String,
  PlaylistLink: String,
  PlaylistID: String,
});

module.exports = mongoose.model("SheetData", sheetSchema);
