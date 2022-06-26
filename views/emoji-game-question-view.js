const { getMedalEmoji, userTagList } = require('./utils');
const { EMOJI_GUESS_BUTTON_ACTION_ID } = require('../constants');

const emojiGameQuestionsView = (
  gameId, duration, questions, remainingTimeInSeconds,
  correctUsersByQuestion = {}, podiumUserScoreList = {},
) => {
  const intro = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        `Welcome to the emoji game. You have ${duration} minutes to solve these. `
        + 'Click on the button next to the question to respond. '
        + 'Winners will be announced at the end of the game. Adios untill then..\n\n *Here are our questions:*',
    },
  };

  const blocks = [intro];
  questions.forEach((q) => {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${q.question}\n\n Hint: ${q.hints[0]}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Guess',
          },
          style: 'primary',
          action_id: EMOJI_GUESS_BUTTON_ACTION_ID,
          value: `${gameId}|${q._id}`,
        },
      },
    );

    if (correctUsersByQuestion[q._id]) {
      const correctUsers = correctUsersByQuestion[q._id];

      blocks.push(
        {
          type: 'context',
          elements: [{
            type: 'mrkdwn',
            text: `:tada: Good job: ${userTagList(correctUsers)}`,
          }],
        },
      );
    }
  });

  if (podiumUserScoreList.length > 0) {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*On the podium currently :trophy:*',
        },
      },
    );

    podiumUserScoreList.forEach(({ score, slackUserIds }, idx) => {
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${getMedalEmoji(idx + 1)} ${userTagList(slackUserIds)} (${score}/${questions.length})`,
          },
        },
      );
    });
  }

  const remainingTimeText = `${Math.ceil(remainingTimeInSeconds / 60)} min`;

  blocks.push(
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\nTime left : ${remainingTimeText}`,
      },
    },
  );

  return { blocks };
};

module.exports = {
  emojiGameQuestionsView,
};
