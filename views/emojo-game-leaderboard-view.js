const {
  getMedalEmoji, userTagList,
  gifWhenPodiumHasWinners, gifWhenPodiumHasNoWinners, gifWhenGameMissed,
} = require('./utils');

const showAnswers = (questions, correctUsersByQuestion) => {
  const blocks = [];

  blocks.push(
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Answers:*',
      },
    },
  );

  questions.forEach((q) => {
    blocks.push(
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `${q.question}  |  *${q.answer}*`,
        }],
      },
    );

    if (correctUsersByQuestion[q._id]) {
      const correctUsers = correctUsersByQuestion[q._id];

      blocks.push(
        {
          type: 'context',
          elements: [{
            type: 'mrkdwn',
            text: `Good job: ${userTagList(correctUsers)}`,
          }],
        },
      );
    }
  });

  return blocks;
};

const showGameInfo = (hostSlackId, nQuestions, duration, totalParticipants) => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: `Hosted By: *<@${hostSlackId}>* | ${nQuestions} questions | Game Duration: ${duration} mins | Participants: ${totalParticipants}`,
    },
  ],
});

const showWinners = (podiumUserScoreList, nQuestions) => {
  const blocks = [];
  blocks.push(
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Winners* :trophy:',
      },
    },
  );

  podiumUserScoreList.forEach(({ score, slackUserIds }, idx) => {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${getMedalEmoji(idx + 1)} ${userTagList(slackUserIds)} (${score}/${nQuestions})`,
        },
      },
    );
  });

  return blocks;
};

const emojiGameLeaderboardView = (
  podiumUserScoreList, questions, correctUsersByQuestion, hostSlackId, duration, totalParticipants,
) => {
  const blocks = [];
  const nQuestions = questions.length;

  blocks.push(
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'We just completed a round of Emoji Guess :tada:',
      },
    },
  );

  if (podiumUserScoreList.length > 0) {
    blocks.push(
      ...showWinners(podiumUserScoreList, nQuestions),
    );

    blocks.push(
      {
        type: 'image',
        image_url: gifWhenPodiumHasWinners(),
        alt_text: 'GIF',
        title: {
          type: 'plain_text',
          text: 'GIF',
          emoji: true,
        },
      },
    );
  } else if (podiumUserScoreList.length === 0 && totalParticipants > 0) {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Nobody got even one question right. :confused:',
        },
      },
      {
        type: 'image',
        image_url: gifWhenPodiumHasNoWinners(),
        alt_text: 'GIF',
        title: {
          type: 'plain_text',
          text: 'GIF',
          emoji: true,
        },
      },
    );
  } else {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: "But ya'll missed the game :sob:",
        },
      },
      {
        type: 'image',
        image_url: gifWhenGameMissed(),
        alt_text: 'GIF',
        title: {
          type: 'plain_text',
          text: 'GIF',
          emoji: true,
        },
      },
    );
  }

  blocks.push(
    showGameInfo(hostSlackId, nQuestions, duration, totalParticipants),
  );

  // show answers only if participants > 0
  if (totalParticipants > 0) {
    blocks.push(
      ...showAnswers(questions, correctUsersByQuestion),
    );
  }

  return blocks;
};

module.exports = {
  emojiGameLeaderboardView,
};
