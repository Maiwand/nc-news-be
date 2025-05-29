const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createArticleRef = (articles) => {
  const ref = {};
  articles.forEach(({ title, article_id }) => {
    ref[title] = article_id;
  });
  return ref;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(({ created_by, belongs_to, ...rest }) => {
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      ...rest,
    };
  });
};
