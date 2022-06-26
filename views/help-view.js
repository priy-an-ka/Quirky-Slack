const helpView = () => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Hey! :wave:\n Happy Hours is here!',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*:game_die: Use  `/happy emoji` command to start the Emoji Game*. ',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*:ab: Use the `/happy letters` to start a game of Bag Of Letters*. ',
      },
    },
  ],
});

module.exports = {
  helpView,
};
