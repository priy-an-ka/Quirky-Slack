const { lettersGameWelcomeView } = require('../views');
const { WELCOME_MSG_TIME_IN_SEC } = require('../constants');

const lettersGameWelcomeStateHandler = async (client, game, secondsSinceGameStarted) => {
  await client.chat.update({
    channel: game.location,
    ts: game.threadTs,
    blocks: lettersGameWelcomeView({
      duration: game.duration,
      hostSlackId: game.hostSlackId,
      timeToStartInSeconds: (WELCOME_MSG_TIME_IN_SEC - (secondsSinceGameStarted)),
    }).blocks,
  });
};

module.exports = { lettersGameWelcomeStateHandler };
