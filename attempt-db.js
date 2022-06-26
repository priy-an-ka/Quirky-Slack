/* eslint no-unused-vars: 1 */
const axios = require('axios').default;

const { BOX_ID } = process.env;
const JSONBOX_URL = `https://jsonbox.io/box_${BOX_ID}`;

const insertAttempt = async ({
  gameId, questionId, slackUserId, value, isCorrectAnswer,
}) => axios.post(`${JSONBOX_URL}/attempt`, {
  gameId, questionId, slackUserId, value, isCorrectAnswer,
}).then((it) => it.data);

const getAttempts = async ({
  gameId, questionId, slackUserId, isCorrectAnswer, value,
}) => {
  let searchURL = `${JSONBOX_URL}/attempt?q=`;

  if (gameId) {
    searchURL += `gameId:${gameId},`;
  }

  if (questionId) {
    searchURL += `questionId:${questionId},`;
  }

  if (slackUserId) {
    searchURL += `slackUserId:${slackUserId},`;
  }

  if (isCorrectAnswer) {
    searchURL += `isCorrectAnswer:${isCorrectAnswer},`;
  }

  if (value) {
    searchURL += `value:${value},`;
  }

  if (searchURL.endsWith(',')) {
    searchURL = searchURL.substr(0, searchURL.length - 1);
  }

  return axios.get(searchURL).then((it) => it.data);
};

module.exports = {
  insertAttempt,
  getAttempts,
};
