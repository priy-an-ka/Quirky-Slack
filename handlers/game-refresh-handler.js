const { WebClient } = require('@slack/web-api');
const db = require('../db');
const { invokeTicker } = require('../external_services/ticker');
const { emojiLeaderboardHandler } = require('./emoji-leaderboard-handler');
const { emojiQuestionStateHandler } = require('./emoji-question-state-handler');
const { emojiGameWelcomeStateHandler } = require('./emoji-welcome-state-handler');
const { lettersGameWelcomeStateHandler } = require('./letters-welcome-state-handler');
const { lettersQuestionStateHandler } = require('./letters-question-state-handler');
const { lettersLeaderboardHandler } = require('./letters-leaderboard-handler');
const { WELCOME_MSG_TIME_IN_SEC, GAME_TYPE_EMOJI, GAME_TYPE_LETTERS } = require('../constants');

const inQuestionViewState = (deltaInMs, gameDuration) => deltaInMs < (
  (WELCOME_MSG_TIME_IN_SEC + (gameDuration * 60)) * 1000
);

const inWelcomeMsgState = (deltaInMs) => deltaInMs < (WELCOME_MSG_TIME_IN_SEC * 1000);

const gameRefreshHandler = async (gameId) => {
  const client = new WebClient(process.env.SLACK_BOT_TOKEN);

  const game = await db.getGame(gameId);

  const currentTime = new Date();
  const gameStartTime = new Date(game._createdOn);

  const deltaInMs = currentTime - gameStartTime;
  const secondsSinceGameStarted = Math.floor((deltaInMs) / 1000);

  if (inWelcomeMsgState(deltaInMs)) {
    if (game.type === GAME_TYPE_EMOJI) {
      await emojiGameWelcomeStateHandler(client, game, secondsSinceGameStarted);
    } else if (game.type === GAME_TYPE_LETTERS) {
      await lettersGameWelcomeStateHandler(client, game, secondsSinceGameStarted);
    }
  } else if (inQuestionViewState(deltaInMs, game.duration)) {
    if (game.type === GAME_TYPE_EMOJI) {
      await emojiQuestionStateHandler(client, game, secondsSinceGameStarted);
    } else if (game.type === GAME_TYPE_LETTERS) {
      await lettersQuestionStateHandler(client, game, secondsSinceGameStarted);
    }
  } else if (game.type === GAME_TYPE_EMOJI) {
    await emojiLeaderboardHandler(client, game);
  } else if (game.type === GAME_TYPE_LETTERS) {
    await lettersLeaderboardHandler(client, game);
  }
};

const propagateTicker = async (gameId) => {
  const game = await db.getGame(gameId);

  const currentTime = new Date();
  const gameStartTime = new Date(game._createdOn);
  const deltaInMs = currentTime - gameStartTime;

  if (inWelcomeMsgState(deltaInMs)) {
    await invokeTicker(gameId, 5);
  } else if (inQuestionViewState(deltaInMs, game.duration)) {
    await invokeTicker(gameId, 60);
  }
};

module.exports = {
  gameRefreshHandler,
  propagateTicker,
};
