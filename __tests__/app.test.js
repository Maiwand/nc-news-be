const endpointsJson = require("../endpoints.json");

const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("GET - 200: Serves the HTML document", () => {
    return request(app)
      .get("/api/")
      .expect("Content-Type", /html/)
      .expect(200)
      .then(({ text }) => {
        expect(text).toContain("<!DOCTYPE html>");
        expect(text).toContain("<h1>NC News API</h1>");
      });
  });
});

describe("GET /api/json", () => {
  test("GET - 200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api/json")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("/api/topics", () => {
  test("GET - 200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBeGreaterThan(0);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET - 200: Responds with an array of all articles including comment count and without body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
        });
        const dates = body.articles.map((article) => article.created_at);
        const sorted = [...dates].sort().reverse();
        expect(dates).toEqual(sorted);
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("GET - 200: sorts by a valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("GET - 200: accepts order=asc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("GET - 400: invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by column");
      });
  });

  test("GET - 400: invalid order query", () => {
    return request(app)
      .get("/api/articles?order=sideways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });

  test("GET - 200: responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("GET - 404: responds with error when topic exists but has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No articles found for topic: paper");
      });
  });

  test("GET - 404: responds with error when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("/api/users", () => {
  test("GET - 200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET - 200: Responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(typeof article).toBe("object");
        expect(article).not.toBeNull();
        expect(article.article_id).toBe(1);
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("GET - 400: responds with Bad Request for invalid ID", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("GET - 404: responds with Article not found for valid but non-existent ID", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 9999 not found");
      });
  });

  test("GET - 200: responds with an article including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET - 200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
        const dates = body.comments.map((comment) => comment.created_at);
        const sorted = [...dates].sort().reverse();
        expect(dates).toEqual(sorted);
      });
  });

  test("GET - 400: responds with Bad Request for invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("GET - 404: responds with Article not found for valid but non-existent ID", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 9999 not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST - 201: Responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Amazing article!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes", 0);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("Amazing article!");
        expect(comment.article_id).toBe(1);
      });
  });

  test("POST - 400: Missing body or username", () => {
    const badComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(badComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("POST - 400: Invalid article_id", () => {
    return request(app)
      .post("/api/articles/dog/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("POST - 404: Article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("POST - 404: Username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "ghost_user", body: "hello" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH - /api/articles/:article_id", () => {
  test("PATCH - 200: Updates the vote count and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(110);
        expect(body.article.article_id).toBe(1);
      });
  });

  test("PATCH - 404: responds with not found for non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("PATCH - 400: responds with bad request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid inc_votes format");
      });
  });

  test("PATCH - 400: responds with bad request when article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/notanid")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE - 204: deletes a comment by ID and returns no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE - 404: valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found!");
      });
  });

  test("DELETE - 400: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
