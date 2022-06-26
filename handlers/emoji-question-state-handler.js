const { groupBy, calculatePodiumUserScoreList, sortByCreatedOnAsc } = require('./utils');
const { emojiGameQuestionsView } = require('../views');
const db = require('../db');
const { WELCOME_MSG_TIME_IN_SEC } = require('../constants');

const emojiQuestionStateHandler = async (client, game, secondsSinceGameStarted) => {
  const gameTimeRemainingInSec = WELCOME_MSG_TIME_IN_SEC
      + (game.duration * 60) - secondsSinceGameStarted;

  const questions = await db.getQuestionByIds(game.questionIds);
  const correctAns = await db.getAttempts({ gameId: game._id, isCorrectAnswer: true });
  const correctUsersByQuestion = groupBy(
    correctAns.sort(sortByCreatedOnAsc),
    (a) => a.questionId, (a) => a.slackUserId,
  );

  return client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    ...emojiGameQuestionsView(
      game._id, game.duration, questions, gameTimeRemainingInSec,
      correctUsersByQuestion, calculatePodiumUserScoreList(correctAns),
    ),
  });
};

module.exports = { emojiQuestionStateHandler };
