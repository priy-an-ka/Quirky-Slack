const introduceBotView = (user) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Hello people! :wave: <@${user}> added me to this channel for some fun! `,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '\n I am your Quirky Bot \n If you need some help here, hit /help command! ',
      },
    },
  ],
});

module.exports = {
  introduceBotView,
};
