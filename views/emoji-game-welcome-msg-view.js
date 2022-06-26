const { roundToClosestMultipleOfFive } = require('./utils');

const emojiGameWelcomeView = ({
  duration, nQuestions, hostSlackId, timeToStartInSeconds,
}) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '@here\n\n'
                + 'A game of Emoji guess is about to start :rotating_light:\n\n'
                + `:question: *Questions: ${nQuestions}*\n`
                + `:stopwatch: *Duration: ${duration} min*\n\n\n`
                + `:hugging_face: *Game Host:* <@${hostSlackId}>\n\n`
                + 'This is your chance to show off your pop-culture knowledge :fire: \n\n'
                + `Game starts in : ${roundToClosestMultipleOfFive(timeToStartInSeconds)} sec`,
      },
    },
  ],
});

module.exports = {
  emojiGameWelcomeView,
};
