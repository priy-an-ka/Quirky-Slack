const { LETTERS_ANSWER_BUTTON_ACTION_ID } = require('../constants');
const {
  getMedalEmoji, userTagList, batchArray, capitalize,
} = require('./utils');
const { getLettersGameRules } = require('./letters-game-welcome-msg-view');

const getEmojiForWord = (word) => {
  // TODO: Should we handle 1,2,3,4 cases here?
  // The assumption here is that we only accept submissions >= 5 letters
  switch (word.length) {
    case 5:
      return ':white_check_mark:';
    case 6:
      return ':nerd_face:';
    case 7:
      return ':brain:';
    default:
      return ':exploding_head:';
  }
};

// Words answered till now, batched into pieces of 10 items
// elements have a 10 item limit
const correctAnswersSections = (correctAns) => {
  const blocks = [];

  batchArray(correctAns, 10).forEach((batchAns) => {
    blocks.push({
      type: 'context',
      elements: [
        ...(batchAns.map((a) => ({
          type: 'mrkdwn',
          text: `${getEmojiForWord(a.value)} ${capitalize(a.value)} <@${a.slackUserId}>`,
        }))),
      ],
    });
  });

  return blocks;
};

const lettersGameQuestionView = (
  gameId, duration, question, remainingTimeInSeconds, correctAns, podiumUserScoreList = [],
) => {
  const intro = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        `Welcome to the Bag of Letters game.\n\n${
          getLettersGameRules()}`,
    },
  };

  const blocks = [intro];

  blocks.push(
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\n\n*${question.question}*`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Answer',
            emoji: true,
          },
          style: 'primary',
          value: `${gameId}|${question._id}`,
          action_id: LETTERS_ANSWER_BUTTON_ACTION_ID,
        },
      ],
    },
  );

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
            text: `${getMedalEmoji(idx + 1)} ${userTagList(slackUserIds)} (${score} points)`,
          },
        },
      );
    });
  }

  if (correctAns.length > 0) {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: 'Answers so far:',
            emoji: true,
          },
        ],
      },
    );

    blocks.push(...correctAnswersSections(correctAns));
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
  lettersGameQuestionView,
  correctAnswersSections,
};
