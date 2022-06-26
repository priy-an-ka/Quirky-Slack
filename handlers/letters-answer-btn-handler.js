const db = require('../db');
const { lettersAnswerModalView } = require('../views');

const lettersAnswerBtnHandler = async ({
  body, ack, client, action,
}) => {
  await ack();

  const [gameId, questionId] = action.value.split('|');
  const privateMetadata = { gameId, questionId };
  const { question } = await db.getQuestionById(questionId);

  await client.views.open({
    trigger_id: body.trigger_id,
    view: lettersAnswerModalView(question, privateMetadata),
  });
};

module.exports = {
  lettersAnswerBtnHandler,
};
