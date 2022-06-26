const {
  LETTERS_INPUT_SUBMISSION_ACTION_ID,
  LETTERS_ANSWER_MODAL_SUBMISSION_CALLBACK_ID,
} = require('../constants');

const lettersAnswerModalView = (question, privateMetadata) => ({
  callback_id: LETTERS_ANSWER_MODAL_SUBMISSION_CALLBACK_ID,
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
        action_id: LETTERS_INPUT_SUBMISSION_ACTION_ID,
        placeholder: {
          type: 'plain_text',
          text: 'Answer',
        },
      },
      label: {
        type: 'plain_text',
        text: question,
      },
    },
  ],
  type: 'modal',
});

module.exports = {
  lettersAnswerModalView,
};
