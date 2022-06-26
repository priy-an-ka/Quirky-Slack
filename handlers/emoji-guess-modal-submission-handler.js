const natural = require('natural');
const db = require('../db');
const { gameRefreshHandler } = require('./game-refresh-handler');
const { errorMessageModal } = require('../views');
const { EMOJI_INPUT_SUBMISSION_ACTION_ID, EMOJI_JARO_WINKLER_THRESHOLD, GAME_STATUS_COMPLETED } = require('../constants');

const calculateIfCorrectAnswer = (question, inputAnswer) => {
  const lowerCaseInputAnswer = inputAnswer.toLowerCase();
  return question.answers.some((answer) => natural
    .JaroWinklerDistance(answer.toLowerCase(),
      lowerCaseInputAnswer) > EMOJI_JARO_WINKLER_THRESHOLD);
};

const emojiGuessModalSubmissionHandler = async ({
  ack, body, view, client,
}) => {
  await ack();

  const inputBlockId = view.blocks[0].block_id;
  const inputAnswer = view.state.values[inputBlockId][EMOJI_INPUT_SUBMISSION_ACTION_ID].value;

  const slackUserId = body.user.id;

  const { questionId, gameId } = JSON.parse(view.private_metadata);
  const game = await db.getGame(gameId);
  const question = await db.getQuestionById(questionId);

  if (game.state === GAME_STATUS_COMPLETED) {
    return client.chat.postEphemeral({
      channel: game.location,
      user: slackUserId,
      text: `:eyes: <@${slackUserId}> Game time over buddy.`,
    });
  }

  const correctAttempts = await db.getAttempts({
    slackUserId, gameId, questionId, isCorrectAnswer: true,
  });

  if (correctAttempts.length !== 0) {
    return client.chat.postEphemeral({
      channel: game.location,
      user: slackUserId,
      text: `:eyes: <@${slackUserId}> You already answered this question correctly.`,
    });
  }

  const isCorrectAnswer = calculateIfCorrectAnswer(question, inputAnswer);

  await db.insertAttempt({
    gameId: game._id, questionId, slackUserId, value: inputAnswer, isCorrectAnswer,
  });

  if (isCorrectAnswer) {
    return gameRefreshHandler(game._id);
  }
  return client.views.open({
    trigger_id: body.trigger_id,
    view: errorMessageModal(`*${inputAnswer}* is not the correct answer for ${question.question}`),
  });
};

module.exports = {
  emojiGuessModalSubmissionHandler,
};
