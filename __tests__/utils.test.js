const {
  convertTimestampToDate,
  createArticleRef,
  formatComments,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createArticleRef", () => {
  test("returns an empty object when given an empty array", () => {
    expect(createArticleRef([])).toEqual({});
  });

  test("returns correct mapping for one article", () => {
    const input = [{ article_id: 1, title: "A" }];
    const result = createArticleRef(input);
    expect(result).toEqual({ A: 1 });
  });

  test("returns correct mapping for multiple articles", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
    ];
    const result = createArticleRef(input);
    expect(result).toEqual({ A: 1, B: 2 });
  });

  test("does not mutate the original array", () => {
    const input = [{ article_id: 3, title: "Z" }];
    const copy = [...input];
    createArticleRef(input);
    expect(input).toEqual(copy);
  });
});

describe("formatComments", () => {
  test("returns an empty array when given an empty array", () => {
    expect(formatComments([], {})).toEqual([]);
  });

  test("returns correctly formatted comment object", () => {
    const comments = [
      {
        created_by: "user1",
        belongs_to: "Article A",
        body: "comment body",
        votes: 10,
        created_at: 1600000000000,
      },
    ];
    const ref = { "Article A": 101 };
    const result = formatComments(comments, ref);
    expect(result).toEqual([
      {
        author: "user1",
        article_id: 101,
        body: "comment body",
        votes: 10,
        created_at: 1600000000000,
      },
    ]);
  });

  test("does not mutate original comment object", () => {
    const original = [
      {
        created_by: "user2",
        belongs_to: "Article B",
        body: "another body",
        votes: 5,
      },
    ];
    const copy = JSON.parse(JSON.stringify(original));
    formatComments(original, { "Article B": 202 });
    expect(original).toEqual(copy);
  });

  test("ignores unknown article titles (article_id becomes undefined)", () => {
    const comments = [
      {
        created_by: "userX",
        belongs_to: "Nonexistent Article",
        body: "body text",
      },
    ];
    const ref = {};
    const result = formatComments(comments, ref);
    expect(result[0].article_id).toBeUndefined();
  });
});
