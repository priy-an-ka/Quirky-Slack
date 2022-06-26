const errorMessageModal = (mrkdwnText) => ({
  type: 'modal',
  title: {
    type: 'plain_text',
    text: ':confused:',
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: mrkdwnText,
      },
    },
  ],
});

module.exports = { errorMessageModal };
