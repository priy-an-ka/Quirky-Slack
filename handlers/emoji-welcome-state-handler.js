const { emojiGameWelcomeView } = require('../views');
const { WELCOME_MSG_TIME_IN_SEC } = require('../constants');

const emojiGameWelcomeStateHandler = async (client, game, secondsSinceGameStarted) => {
  await client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    blocks: emojiGameWelcomeView({
      duration: game.duration,
      nQuestions: game.nQuestions,
      hostSlackId: game.hostSlackId,
      timeToStartInSeconds: (WELCOME_MSG_TIME_IN_SEC - (secondsSinceGameStarted)),
    }).blocks,
  });
};

module.exports = { emojiGameWelcomeStateHandler };
