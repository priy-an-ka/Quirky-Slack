const { roundToClosestMultipleOfFive } = require('./utils');

const getLettersGameRules = () => '*Rules* :cop:\n'
  + '1. Form words from a set of alphabets and show off your vocabulary.\n'
  + '2. Be on your fingers, because the first correct submission will be considered.\n'
  + '3. The longer the word, the better and no word less than 5 characters will be counted.\n'
  + '4. For each correct submission you get points equal to the length of your word.\n'
  + '5. And brownie points for the one who finds the longest word.\n\n';

const lettersGameWelcomeView = ({
  duration, hostSlackId, timeToStartInSeconds,
}) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '@here'
                    + ` *Bag of Letters is about to start* :rotating_light:\n\n${getLettersGameRules()}`
                    + `:stopwatch: *Duration: ${duration} min*\n\n`
                    + `:hugging_face: *Game Host:* <@${hostSlackId}>\n\n`
                    + `Game starts in : ${roundToClosestMultipleOfFive(timeToStartInSeconds)} sec`,
      },
    },
  ],
});

module.exports = {
  lettersGameWelcomeView,
  getLettersGameRules,
};
