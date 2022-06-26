const {
  LETTERS_GAME_DURATION_OPTIONS, TRIGGER_LETTERS_MODAL_CALLBACK_ID,
  CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID,
  GAME_DURATION_BLOCK_ID, GAME_DURATION_ACTION_ID,
} = require('../constants');

const lettersGameHostModal = (defaultChannelId) => (
  {
    type: 'modal',
    callback_id: TRIGGER_LETTERS_MODAL_CALLBACK_ID,
    title: {
      type: 'plain_text',
      text: 'Play or Host :dart: ',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
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
              'private',
            ],

            exclude_bot_users: true,

          },
          initial_conversation: defaultChannelId,

        },
        label: {
          type: 'plain_text',
          text: 'Select a channel to start the game\n',
          emoji: true,
        },
      },
      {
        block_id: GAME_DURATION_BLOCK_ID,
        type: 'input',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select game duration',
            emoji: true,
          },

          options: [
            ...(LETTERS_GAME_DURATION_OPTIONS.map((durationOption) => ({
              text: {
                type: 'plain_text',
                text: `${durationOption} mins`,
                emoji: true,
              },
              value: `game-duration-${durationOption}`,
            }))),
          ],
          action_id: GAME_DURATION_ACTION_ID,
          initial_option: {
            text: {
              type: 'plain_text',
              text: `${LETTERS_GAME_DURATION_OPTIONS[1]} mins`,
              emoji: true,
            },
            value: `game-duration-${LETTERS_GAME_DURATION_OPTIONS[1]}`,
          },
        },
        label: {
          type: 'plain_text',
          text: 'Select game duration',
          emoji: true,
        },
      },
    ],
  }

);

module.exports = {
  lettersGameHostModal,
};
