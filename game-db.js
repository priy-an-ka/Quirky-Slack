/* eslint no-unused-vars: 1 */
const axios = require('axios').default;
const { sanitizedObj } = require('./utils.js');
const { GAME_STATUS_CREATED } = require('../constants');

const { BOX_ID } = process.env;
const JSONBOX_URL = `https://jsonbox.io/box_${BOX_ID}`;

const insertGame = async ({
  type, location, duration, nQuestions, hostSlackId, orgId, questionIds, threadTs,
}) => axios.post(`${JSONBOX_URL}/game`, {
  type,
  location,
  duration,
  nQuestions,
  hostSlackId,
  orgId,
  state: GAME_STATUS_CREATED,
  questionIds,
  threadTs,
}).then((it) => it.data);

const getGame = async (gameId) => axios.get(`${JSONBOX_URL}/game/${gameId}`).then((it) => it.data);

const updateGame = async (id, values) => getGame(id).then(
  (game) => {
    // Body passed for update should not contain keys set by jsonBox
    const sanitizedGame = sanitizedObj(game);
    return axios.put(`${JSONBOX_URL}/game/${id}`, { ...sanitizedGame, ...values });
  },
).then((it) => it.data);

const getGameStatusForChannel = async (location) => axios.get(`${JSONBOX_URL}/game?q=state:${GAME_STATUS_CREATED},location:${location}`).then((it) => it.data);

module.exports = {
  insertGame,
  updateGame,
  getGame,
  getGameStatusForChannel,
};
