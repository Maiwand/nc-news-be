const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createArticleRef,
  formatComments,
} = require("./utils");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  savedArticlesData,
  userTopicsData,
  userArticleVotesData,
}) => {
  await db.query(
    `DROP TABLE IF EXISTS user_article_votes, user_topics, saved_articles, comments, articles, users, topics;`
  );

  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000),
      bio TEXT,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE saved_articles (
      saved_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(username, article_id)
    );
  `);

  await db.query(`
    CREATE TABLE user_topics (
      user_topic_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
      topic_slug VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
      followed_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (username, topic_slug)
    );
  `);

  await db.query(`
    CREATE TABLE user_article_votes (
      user_article_vote_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      vote_count INT CHECK (vote_count IN (-1, 1)),
      voted_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (username, article_id)
    );
  `);

  const topicInsertQuery = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
    topicData.map(({ slug, description, img_url }) => [
      slug,
      description,
      img_url,
    ])
  );
  await db.query(topicInsertQuery);

  const userInsertQuery = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  await db.query(userInsertQuery);

  const formattedArticles = articleData.map(convertTimestampToDate);

  const articleInsertQuery = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
    formattedArticles.map(
      ({ title, topic, author, body, created_at, votes, article_img_url }) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
        article_img_url,
      ]
    )
  );
  const { rows: insertedArticles } = await db.query(articleInsertQuery);

  const articleRef = createArticleRef(insertedArticles);
  const formattedComments = commentData
    .map(convertTimestampToDate)
    .map((comment) => formatComments([comment], articleRef)[0]);

  const commentInsertQuery = format(
    `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;`,
    formattedComments.map(({ author, article_id, votes, created_at, body }) => [
      author,
      article_id,
      votes,
      created_at,
      body,
    ])
  );
  await db.query(commentInsertQuery);

  const savedArticlesInsertQuery = format(
    `INSERT INTO saved_articles (username, article_id) VALUES %L RETURNING *;`,
    savedArticlesData.map(({ username, article_id }) => [username, article_id])
  );
  await db.query(savedArticlesInsertQuery);

  const userTopicsInsertQuery = format(
    `INSERT INTO user_topics (username, topic_slug) VALUES %L RETURNING *;`,
    userTopicsData.map(({ username, topic_slug }) => [username, topic_slug])
  );
  await db.query(userTopicsInsertQuery);

  const userVotesInsertQuery = format(
    `INSERT INTO user_article_votes (username, article_id, vote_count) VALUES %L RETURNING *;`,
    userArticleVotesData.map(({ username, article_id, vote_count }) => [
      username,
      article_id,
      vote_count,
    ])
  );
  await db.query(userVotesInsertQuery);
};

module.exports = seed;
