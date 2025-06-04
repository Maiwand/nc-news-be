const { selectTopics } = require("../models/topics.model");

const getTopics = (request, response) => {
  selectTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics };
