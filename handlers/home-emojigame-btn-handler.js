const { emojiGameHostModal } = require('../views');
const { randomChannelId } = require('./utils');

const homeEmojigameBtnHandler = async ({
  client, body, ack,
}) => {
  await ack();
  const channelId = await randomChannelId(client);
  await client.views.open({
    trigger_id: body.trigger_id,
    view: emojiGameHostModal(channelId),
  });
};

module.exports = {
  homeEmojigameBtnHandler,
};
