const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithManyBlogs = [
    {
      _id: "62beed1c871e652f33f64a3f",
      title: "MyLife",
      author: "Boris Jhonson",
      url: "borisjhonson.uk/mylife",
      likes: 34131424,
      __v: 0,
    },
    {
      _id: "62bef2c6fe5655f645e0715e",
      title: "Bombass",
      author: "Petro Poroshenko",
      url: "petro.org",
      likes: 34245,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5);
  });

  test("of a bigger list calculated right", () => {
    expect(listHelper.totalLikes(listWithManyBlogs)).toBe(34131424 + 34245);
  });
});

describe("most liked", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithManyBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "62beed1c871e652f33f64a3f",
      title: "MyLife",
      author: "Boris Jhonson",
      url: "borisjhonson.uk/mylife",
      likes: 34131424,
      __v: 0,
    },
    {
      _id: "62bef2c6fe5655f645e0715e",
      title: "Bombass",
      author: "Petro Poroshenko",
      url: "petro.org",
      likes: 34245,
      __v: 0,
    },
  ];

  test("of zero blogs should be empty object", () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });

  test("of one blog equals that blog", () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(
      listWithOneBlog[0]
    );
  });

  test("of many blogs should work as expected", () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs)).toEqual({
      _id: "62beed1c871e652f33f64a3f",
      title: "MyLife",
      author: "Boris Jhonson",
      url: "borisjhonson.uk/mylife",
      likes: 34131424,
      __v: 0,
    });
  });
});
