const db = require("./db/connection");

db.query("SELECT * FROM users;")
  .then(({ rows: users }) => {
    console.log(users);
    return db.query("SELECT * FROM articles WHERE topic = 'coding';");
  })
  .then(({ rows: codingArticles }) => {
    console.log(codingArticles);
    return db.query("SELECT * FROM comments WHERE votes < 0;");
  })
  .then(({ rows: negativeComments }) => {
    console.log(negativeComments);
    return db.query("SELECT * FROM topics;");
  })
  .then(({ rows: topics }) => {
    console.log(topics);
    return db.query("SELECT * FROM articles WHERE author = 'grumpy19';");
  })
  .then(({ rows: grumpyArticles }) => {
    console.log(grumpyArticles);
    return db.query("SELECT * FROM comments WHERE votes > 10;");
  })
  .then(({ rows: topComments }) => {
    console.log(topComments);
    return db.query(
      "SELECT * FROM saved_articles WHERE username = 'grumpy19';"
    );
  })
  .then(({ rows: grumySavedArticle }) => {
    console.log(grumySavedArticle);
    return db.query("SELECT * FROM user_topics WHERE username = 'tickle122';");
  })
  .then(({ rows: tickleTopics }) => {
    console.log(tickleTopics);
    return db.query("SELECT * FROM user_article_votes WHERE article_id = 2;");
  })
  .then(({ rows: articleVotes }) => {
    console.log(articleVotes);
  })
  .catch(() => {
    console.log("Error running queries");
  })
  .finally(() => {
    db.end();
  });
