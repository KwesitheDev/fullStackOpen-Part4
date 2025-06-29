const Blog = require("../models/blogSchema");

const initialBlog = {
  title: "test",
  author: "KwesitheDev",
  url: "kwesithedev.me",
  likes: 50,
};

const blogInDb = async () => {
  return await Blog.find({});
};

const resetDbWithInitialBlog = async () => {
  await Blog.deleteMany({});
  const blog = new Blog(initialBlog);
  await blog.save();
};

module.exports = {
  initialBlog,
  blogInDb,
  resetDbWithInitialBlog,
};
