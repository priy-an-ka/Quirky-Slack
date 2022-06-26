const db = require('../db');
const { gameRefreshHandler } = require('./game-refresh-handler');
const { errorMessageModal } = require('../views');
const { isWord } = require('../external_services/dictionary');
const { countBy } = require('./utils');
const { LETTERS_INPUT_SUBMISSION_ACTION_ID, GAME_STATUS_COMPLETED } = require('../constants');

const canWordBeFormed = (letterArr, word) => {
  const freqInSet = countBy(letterArr);
  const freqInWord = countBy([...word]);
  return [...word]
    .every((char) => freqInSet[char] !== undefined && freqInSet[char] >= freqInWord[char]);
};

const lettersAnswerModalSubmissionHandler = async ({
  ack, body, view, client,
}) => {
  await ack();

  const inputBlockId = view.blocks[0].block_id;
  const inputAnswer = view.state.values[inputBlockId][LETTERS_INPUT_SUBMISSION_ACTION_ID]
    .value.toLowerCase();

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

  if (inputAnswer.length < 5) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: errorMessageModal(
        ':eyes: Word should have 5 or more letters.',
      ),
    });

    return db.insertAttempt({
      gameId, questionId, slackUserId, value: inputAnswer, isCorrectAnswer: false,
    });
  }

  const letterArr = question.question.toLowerCase().split('-');
  if (!canWordBeFormed(letterArr, inputAnswer)) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: errorMessageModal(
        `${inputAnswer} cannot be formed with the letters in ${question.question}`,
      ),
    });

    return db.insertAttempt({
      gameId, questionId, slackUserId, value: inputAnswer, isCorrectAnswer: false,
    });
  }

  const correctAttempts = await db.getAttempts({
    gameId, questionId, isCorrectAnswer: true, value: inputAnswer,
  });

  if (correctAttempts.length !== 0) {
    return client.views.open({
      trigger_id: body.trigger_id,
      view: errorMessageModal(
        `:eyes: Someone already answered ${inputAnswer}.`,
      ),
    });
  }

  const isDictionaryWord = await isWord(inputAnswer);
  if (!isDictionaryWord) {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: errorMessageModal(
        `${inputAnswer} is not a valid word`,
      ),
    });

    return db.insertAttempt({
      gameId, questionId, slackUserId, value: inputAnswer, isCorrectAnswer: false,
    });
  }

  await db.insertAttempt({
    gameId: game._id, questionId, slackUserId, value: inputAnswer, isCorrectAnswer: true,
  });

  return gameRefreshHandler(game._id);
};

module.exports = {
  lettersAnswerModalSubmissionHandler,
};
