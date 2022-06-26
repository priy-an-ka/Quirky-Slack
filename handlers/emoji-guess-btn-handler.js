const db = require('../db');
const { emojiGuessModalView } = require('../views');

const emojiGuessBtnHandler = async ({
  body, ack, client, action,
}) => {
  await ack();

  const [gameId, questionId] = action.value.split('|');
  const privateMetadata = { gameId, questionId };
  const questionEmoji = (await db.getQuestionById(questionId)).question;

  await client.views.open({
    trigger_id: body.trigger_id,
    view: emojiGuessModalView(questionEmoji, privateMetadata),
  });
};

module.exports = {
  emojiGuessBtnHandler,
};
