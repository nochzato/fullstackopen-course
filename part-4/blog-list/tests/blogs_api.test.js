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

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("get", () => {
  test("returns right amount of blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("returns key named id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("post", () => {
  test("adds one blog properly", async () => {
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

  test("replace missing likes with 0", async () => {
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

  test("sends status 400 if url or title is missing", async () => {
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
});

describe("delete", () => {
  test("removes one blog as expected", async () => {
    const blogs = (await api.get("/api/blogs")).body;

    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const response = await api.get("/api/blogs");
    const ids = response.body.map((blog) => blog.id);

    expect(ids).not.toContain(blogToDelete.id);
  });

  test("sends 400 if id not found", async () => {
    await api.delete("/api/blogs/123").expect(400);
  });
});

describe("put", () => {
  test("updates blog properly", async () => {
    const someBlog = (await api.get("/api/blogs")).body[0];

    const blogToUpdate = {
      ...someBlog,
      title: "another title",
    };

    const returnedBlog = (
      await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
    ).body;

    expect(returnedBlog).toEqual(blogToUpdate);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);

    expect(titles).toContain(blogToUpdate.title);
  });

  test("doesn't update if missing title or url", async () => {
    const someBlog = (await api.get("/api/blogs")).body[0];

    const blogWithoutTitle = {
      ...someBlog,
      title: undefined,
    };

    await api
      .put(`/api/blogs/${blogWithoutTitle.id}`)
      .send(blogWithoutTitle)
      .expect(400);

    const blogWithoutUrl = {
      ...someBlog,
      url: undefined,
    };

    await api
      .put(`/api/blogs/${blogWithoutUrl.id}`)
      .send(blogWithoutUrl)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
