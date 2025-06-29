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

const getFirstBlogID = async () => {
    const blogs = await blogInDb()
    return blogs[0].id
}

module.exports = {
  initialBlog,
  blogInDb,
    resetDbWithInitialBlog,
  getFirstBlogID
};
