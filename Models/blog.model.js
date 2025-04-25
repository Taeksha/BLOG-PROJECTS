const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content : String,
  tags: String,
  publishedDate: String
});
const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
