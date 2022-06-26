const { lettersGameHostModal } = require('../views');
const { randomChannelId } = require('./utils');

const homeLettersBtnHandler = async ({
  client, body, ack,
}) => {
  await ack();
  const channelId = await randomChannelId(client);
  await client.views.open({
    trigger_id: body.trigger_id,
    view: lettersGameHostModal(channelId),
  });
};

module.exports = {
  homeLettersBtnHandler,
};
