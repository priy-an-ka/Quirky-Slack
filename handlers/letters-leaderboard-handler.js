const db = require('../db');
const { lettersGameLeaderboardView } = require('../views');
const { calculatePodiumUserScoreList, sortByAnswerLength } = require('./utils');
const { GAME_STATUS_COMPLETED } = require('../constants');

const lettersLeaderboardHandler = async (client, game) => {
  await db.updateGame(game._id, { state: GAME_STATUS_COMPLETED });

  const allAttemptsInGame = await db.getAttempts({ gameId: game._id });
  const totalParticipants = [...new Set(allAttemptsInGame.map((a) => a.slackUserId))].length;
  const correctAns = allAttemptsInGame.filter((a) => a.isCorrectAnswer).sort(sortByAnswerLength);
  const scoreByLength = (ans) => ans.value.length;
  const podiumUserScoreList = calculatePodiumUserScoreList(correctAns, scoreByLength);

  await client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    blocks: lettersGameLeaderboardView(
      podiumUserScoreList, game.hostSlackId, game.duration, totalParticipants, correctAns,
    ),
  });
};

const lettersLeaderboardHandlerClosure = (client, gameId) => async () => {
  const game = await db.getGame(gameId);
  return lettersLeaderboardHandler(client, game);
};

module.exports = {
  lettersLeaderboardHandler,
  lettersLeaderboardHandlerClosure,
};
