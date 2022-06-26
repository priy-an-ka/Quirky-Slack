const {
  TRIGGER_EMOJI_MODAL_CALLBACK_ID, EMOJI_NUMBER_OF_QUESTIONS_OPTIONS,
  EMOJI_GAME_DURATION_OPTIONS, CHANNEL_ACTION_ID, QUESTION_NUMBERS_ACTION_ID,
  GAME_DURATION_ACTION_ID,
  CHANNEL_BLOCK_ID,
  QUESTION_NUMBERS_BLOCK_ID,
  GAME_DURATION_BLOCK_ID,
} = require('../constants');

const emojiGameHostModal = (defaultChannelId) => (
  {
    type: 'modal',
    callback_id: TRIGGER_EMOJI_MODAL_CALLBACK_ID,
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
        type: 'input',
        block_id: QUESTION_NUMBERS_BLOCK_ID,
        element: {

          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Number of questions',
            emoji: true,
          },
          options: [
            ...(EMOJI_NUMBER_OF_QUESTIONS_OPTIONS.map((questionOption) => ({
              text: {
                type: 'plain_text',
                text: questionOption,
                emoji: true,
              },
              value: `question-numbers-${questionOption}`,
            }))),
          ],
          action_id: QUESTION_NUMBERS_ACTION_ID,
          initial_option: {
            text: {
              type: 'plain_text',
              text: EMOJI_NUMBER_OF_QUESTIONS_OPTIONS[1],
              emoji: true,
            },
            value: `question-numbers-${EMOJI_NUMBER_OF_QUESTIONS_OPTIONS[1]}`,
          },
        },
        label: {
          type: 'plain_text',
          text: 'Select number of questions for the game',
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
            text: 'Game duration',
            emoji: true,
          },
          options: [
            ...(EMOJI_GAME_DURATION_OPTIONS.map((durationOption) => ({
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
              text: `${EMOJI_GAME_DURATION_OPTIONS[2]} mins`,
              emoji: true,
            },
            value: `game-duration-${EMOJI_GAME_DURATION_OPTIONS[2]}`,
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
  emojiGameHostModal,
};
