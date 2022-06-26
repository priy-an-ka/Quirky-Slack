const db = require('../db');
const { invokeTicker } = require('../external_services/ticker');
const { lettersGameWelcomeView } = require('../views');
const { pickRandomItem } = require('../views/utils');
const { distribute } = require('./utils');
const { lettersQuestionStateHandler } = require('./letters-question-state-handler');
const { validateGameRunningInChannel } = require('./game-status-for-channel');
const {
  CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID,
  WELCOME_MSG_TIME_IN_SEC, GAME_DURATION_BLOCK_ID,
  GAME_DURATION_ACTION_ID, GAME_TYPE_LETTERS,
} = require('../constants');
const { lettersLeaderboardHandlerClosure } = require('./letters-leaderboard-handler');

const generateBagOfLetters = () => {
  // [letter, times] -> higher times means higher odds of getting picked
  // this mechanism is used to reduce chance of hard-letters from getting picked
  const consonants = distribute([
    ['B', 3], ['C', 2], ['D', 3], ['F', 2],
    ['G', 2], ['H', 3], ['J', 2], ['K', 3],
    ['L', 3], ['M', 3], ['N', 3], ['P', 3],
    ['Q', 1], ['R', 3], ['S', 3], ['T', 3],
    ['V', 2], ['W', 1], ['X', 1], ['Y', 2],
    ['Z', 1],
  ]);

  const vowels = distribute([['A', 3], ['E', 4], ['I', 2], ['O', 3], ['U', 2]]);

  const bag = [];
  for (let i = 0; i < 5; i += 1) {
    bag.push(pickRandomItem(vowels));
  }

  for (let i = 0; i < 13; i += 1) {
    bag.push(pickRandomItem(consonants));
  }

  return bag.sort().join('-');
};

const triggerLettersGame = async ({
  ack, body, client,
}) => {
  await ack();

  const location = body.view.state.values[CHANNEL_BLOCK_ID][CHANNEL_ACTION_ID]
    .selected_conversation;
  const hostSlackId = body.user.id;

  // TODO: Should this check be run at a per game type basis?
  const isGameRunningInChannel = await validateGameRunningInChannel(client, location, hostSlackId);
  if (isGameRunningInChannel) {
    return;
  }

  const duration = (body.view.state.values[GAME_DURATION_BLOCK_ID][GAME_DURATION_ACTION_ID]
    .selected_option.text.text).split(' ')[0];
  const orgId = body.user.team_id;

  const gameWelcome = await client.chat.postMessage({
    channel: location,
    blocks: lettersGameWelcomeView({
      duration, hostSlackId, timeToStartInSeconds: WELCOME_MSG_TIME_IN_SEC,
    }).blocks,
  });

  const question = await db.insertQuestion({ question: generateBagOfLetters() });

  const game = await db.insertGame({
    type: GAME_TYPE_LETTERS,
    location,
    duration,
    nQuestions: 1,
    hostSlackId,
    orgId,
    questionIds: [question._id],
    threadTs: gameWelcome.ts,
  });

  invokeTicker(game._id, 5);

  setTimeout(async () => {
    lettersQuestionStateHandler(client, game, WELCOME_MSG_TIME_IN_SEC);
  }, WELCOME_MSG_TIME_IN_SEC * 1000);

  setTimeout(
    lettersLeaderboardHandlerClosure(client, game._id),
    (WELCOME_MSG_TIME_IN_SEC * 1000) + (duration * 60 * 1000),
  );
};

module.exports = {
  triggerLettersGame,
};
