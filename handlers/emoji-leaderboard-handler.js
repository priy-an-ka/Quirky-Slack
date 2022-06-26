const db = require('../db');
const { emojiGameLeaderboardView } = require('../views');
const { calculatePodiumUserScoreList, groupBy, sortByCreatedOnAsc } = require('./utils');
const { GAME_STATUS_COMPLETED } = require('../constants');

const emojiLeaderboardHandler = async (client, game) => {
  await db.updateGame(game._id, { state: GAME_STATUS_COMPLETED });

  const allAttemptsInGame = await db.getAttempts({ gameId: game._id });
  const totalParticipants = [...new Set(allAttemptsInGame.map((a) => a.slackUserId))].length;
  const correctAns = allAttemptsInGame.filter((a) => a.isCorrectAnswer).sort(sortByCreatedOnAsc);
  const correctUsersByQuestion = groupBy(correctAns, (a) => a.questionId, (a) => a.slackUserId);
  const podiumUserScoreList = calculatePodiumUserScoreList(correctAns);

  const questions = await db.getQuestionByIds(game.questionIds);

  await client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    blocks: emojiGameLeaderboardView(
      podiumUserScoreList, questions, correctUsersByQuestion,
      game.hostSlackId, game.duration, totalParticipants,
    ),
  });
};

const emojiLeaderboardHandlerClosure = (client, gameId) => async () => {
  const game = await db.getGame(gameId);
  return emojiLeaderboardHandler(client, game);
};

module.exports = {
  emojiLeaderboardHandler,
  emojiLeaderboardHandlerClosure,
};
