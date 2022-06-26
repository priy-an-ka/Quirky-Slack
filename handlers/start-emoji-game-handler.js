const db = require('../db');
const { emojiLeaderboardHandlerClosure } = require('./emoji-leaderboard-handler');
const { emojiQuestionStateHandler } = require('./emoji-question-state-handler');
const { emojiGameWelcomeView } = require('../views');
const { invokeTicker } = require('../external_services/ticker');
const { validateGameRunningInChannel } = require('./game-status-for-channel');
const {
  WELCOME_MSG_TIME_IN_SEC, CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID,
  QUESTION_NUMBERS_BLOCK_ID,
  GAME_DURATION_BLOCK_ID, GAME_DURATION_ACTION_ID,
  QUESTION_NUMBERS_ACTION_ID, GAME_TYPE_EMOJI,
} = require('../constants');

const triggerEmojiGame = async ({
  ack, body, client,
}) => {
  await ack();

  const location = body.view.state.values[CHANNEL_BLOCK_ID][CHANNEL_ACTION_ID]
    .selected_conversation;
  const hostSlackId = body.user.id;

  const isGameRunningInChannel = await validateGameRunningInChannel(client, location, hostSlackId);
  if (isGameRunningInChannel) {
    return;
  }

  const nQuestions = body.view.state.values[QUESTION_NUMBERS_BLOCK_ID][QUESTION_NUMBERS_ACTION_ID]
    .selected_option.text.text;
  const duration = (body.view.state.values[GAME_DURATION_BLOCK_ID][GAME_DURATION_ACTION_ID]
    .selected_option.text.text).split(' ')[0];
  const orgId = body.user.team_id;

  const gameWelcome = await client.chat.postMessage({
    channel: location,
    blocks: emojiGameWelcomeView({
      duration, nQuestions, hostSlackId, timeToStartInSeconds: WELCOME_MSG_TIME_IN_SEC,
    }).blocks,
  });

  const questions = await db.getAllQuestions();
  // TODO: Take random nQuestion number of questions
  const questionIds = questions.map((it) => it._id);

  const game = await db.insertGame({
    type: GAME_TYPE_EMOJI,
    location,
    duration,
    nQuestions,
    hostSlackId,
    orgId,
    questionIds,
    threadTs: gameWelcome.ts,
  });

  invokeTicker(game._id, 5);

  setTimeout(async () => {
    emojiQuestionStateHandler(client, game, WELCOME_MSG_TIME_IN_SEC);
  }, WELCOME_MSG_TIME_IN_SEC * 1000);

  setTimeout(
    emojiLeaderboardHandlerClosure(client, game._id),
    (WELCOME_MSG_TIME_IN_SEC * 1000) + (duration * 60 * 1000),
  );
};

module.exports = {
  triggerEmojiGame,
};
