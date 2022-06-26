const {
  ADD_APP_TO_CHANNEL_CALLBACK_ID,
  CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID,
} = require('../constants');

const addToChannelView = (defaultChannelId) => (

  {
    title: {
      type: 'plain_text',
      text: 'Add To Channel',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Save',
      emoji: true,
    },
    type: 'modal',
    callback_id: ADD_APP_TO_CHANNEL_CALLBACK_ID,
    blocks: [
      {
        type: 'input',
        block_id: CHANNEL_BLOCK_ID,
        element: {
          type: 'conversations_select',
          action_id: CHANNEL_ACTION_ID,
          placeholder: {
            type: 'plain_text',
            text: 'Select a channel',
            emoji: true,
          },
          filter: {
            include: [
              'public',
            ],
            exclude_bot_users: true,
          },
          initial_conversation: defaultChannelId,
        },
        label: {
          type: 'plain_text',
          text: "To invite Quirky to a channel, submit the command @Quirky on the channel's chat or you can add it from here!",
        },
      },
    ],
  }

);

module.exports = {
  addToChannelView,

};
