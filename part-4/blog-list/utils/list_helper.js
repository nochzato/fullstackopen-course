const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, blog) => (prev += blog.likes), 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));

  return blogs.find((blog) => blog.likes === mostLikes);
};

// const mostBlogs = (blogs) => {
//   if (blogs.length === 0) {
//     return {};
//   }

//   const blogsGroupedByAuthor = _.groupBy(blogs, (blog) => blog.author);
//   const numberOfBlogsDoneByOneAuthor = _.mapValues(
//     blogsGroupedByAuthor,
//     (blogs) => blogs.length
//   );
// };

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  // mostBlogs,
};
