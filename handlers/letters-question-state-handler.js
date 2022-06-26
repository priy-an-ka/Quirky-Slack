const { lettersGameQuestionView } = require('../views');
const db = require('../db');
const { calculatePodiumUserScoreList, sortByAnswerLength } = require('./utils');
const { WELCOME_MSG_TIME_IN_SEC } = require('../constants');

const lettersQuestionStateHandler = async (client, game, secondsSinceGameStarted) => {
  const gameTimeRemainingInSec = WELCOME_MSG_TIME_IN_SEC
      + (game.duration * 60) - secondsSinceGameStarted;

  const question = (await db.getQuestionByIds(game.questionIds))[0];
  const correctAns = (await db.getAttempts({
    gameId: game._id,
    questionId: question._id,
    isCorrectAnswer: true,
  })).sort(sortByAnswerLength);

  const scoreByLength = (ans) => ans.value.length;
  const podiumUserScoreList = calculatePodiumUserScoreList(correctAns, scoreByLength);

  return client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    ...lettersGameQuestionView(
      game._id, game.duration, question, gameTimeRemainingInSec, correctAns, podiumUserScoreList,
    ),
  });
};

module.exports = { lettersQuestionStateHandler };
