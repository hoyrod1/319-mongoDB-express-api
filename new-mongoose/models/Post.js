const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comments: {
    content: String,
    author: String,
  },
});

const Post = model("Post", postSchema);

module.exports = Post;
