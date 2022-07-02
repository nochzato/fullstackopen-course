const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Title One",
    author: "Author One",
    url: "example.com",
    likes: 4,
  },
  {
    title: "Title Two",
    author: "Author Two",
    url: "example.ua",
    likes: 10,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("right amount of blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("id is named after itself", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("post adds blog", async () => {
  const newBlog = {
    title: "Title Three",
    author: "Author Three",
    url: "smth.com",
    likes: 31,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain("Title Three");
});

test("if likes is missing it's replaced with 0", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Some author",
    url: "somesite.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const lastBlog = response.body[response.body.length - 1];

  expect(lastBlog.likes).toBe(0);
});

test("if title or url is missing send status 400", async () => {
  const newBlog = {
    author: "some author",
    url: "someurl.url",
    likes: 12,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const anotherBlog = {
    title: "some title",
    author: "some author",
    likes: 12,
  };

  await api.post("/api/blogs").send(anotherBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
