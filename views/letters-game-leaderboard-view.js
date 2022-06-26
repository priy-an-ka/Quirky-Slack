const {
  getMedalEmoji, userTagList,
  gifWhenPodiumHasWinners, gifWhenPodiumHasNoWinners, gifWhenGameMissed,
} = require('./utils');
const { correctAnswersSections } = require('./letters-game-question-view');

const showGameInfo = (hostSlackId, duration, totalParticipants) => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: `Hosted By: *<@${hostSlackId}>* | Game Duration: ${duration} mins | Participants: ${totalParticipants}`,
    },
  ],
});

const showWinners = (podiumUserScoreList) => {
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
          text: `${getMedalEmoji(idx + 1)} ${userTagList(slackUserIds)} (${score} points)`,
        },
      },
    );
  });

  return blocks;
};

const lettersGameLeaderboardView = (
  podiumUserScoreList, hostSlackId, duration, totalParticipants, correctAns,
) => {
  const blocks = [];

  blocks.push(
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'We just completed a round of *Bag of Letters* :tada:',
      },
    },
  );

  if (podiumUserScoreList.length > 0) {
    blocks.push(
      ...showWinners(podiumUserScoreList),
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
    showGameInfo(hostSlackId, duration, totalParticipants),
  );

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
            text: 'Answers:',
            emoji: true,
          },
        ],
      },
    );

    blocks.push(...correctAnswersSections(correctAns));
  }

  return blocks;
};

module.exports = {
  lettersGameLeaderboardView,
};
