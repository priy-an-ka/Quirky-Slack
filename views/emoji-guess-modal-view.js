const {
  EMOJI_INPUT_SUBMISSION_ACTION_ID, EMOJI_GUESS_MODAL_SUBMISSION_CALLBACK_ID,
} = require('../constants');

const emojiGuessModalView = (questionEmoji, privateMetadata) => ({
  callback_id: EMOJI_GUESS_MODAL_SUBMISSION_CALLBACK_ID,
  private_metadata: JSON.stringify(privateMetadata),
  title: {
    type: 'plain_text',
    text: 'Guess',
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
  },
  blocks: [
    {
      type: 'input',
      element: {
        type: 'plain_text_input',
        action_id: EMOJI_INPUT_SUBMISSION_ACTION_ID,
        placeholder: {
          type: 'plain_text',
          text: 'Answer',
        },
      },
      label: {
        type: 'plain_text',
        text: `Question:   ${questionEmoji}`,
      },
    },
  ],
  type: 'modal',
});

module.exports = {
  emojiGuessModalView,
};
