/* eslint no-unused-vars: 1 */
const axios = require('axios').default;
const { associate } = require('../handlers/utils');

const { BOX_ID } = process.env;
const JSONBOX_URL = `https://jsonbox.io/box_${BOX_ID}`;

const getAllQuestions = async () => axios.get(`${JSONBOX_URL}/question`).then((it) => it.data);

const getQuestionById = async (id) => axios.get(`${JSONBOX_URL}/question/${id}`).then((it) => it.data);

const getQuestionByIds = async (ids) => {
  const allQuestions = await getAllQuestions();
  const allQuestionsById = associate(allQuestions, (q) => q._id);
  return ids.map((id) => allQuestionsById[id]).filter((q) => q !== undefined);
};

const insertQuestion = async ({
  question,
  answer,
  answers = [],
  hints = [],
}) => axios.post(`${JSONBOX_URL}/question`, {
  question,
  answer,
  answers,
  hints,
}).then((it) => it.data);

module.exports = {
  getAllQuestions,
  getQuestionById,
  getQuestionByIds,
  insertQuestion,
};
