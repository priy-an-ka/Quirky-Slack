const { addToChannelView } = require('../views');
const { randomChannelId } = require('./utils');

const inviteAppToChannelBtnHandler = async ({
  body, ack, client,
}) => {
  await ack();
  const channelId = await randomChannelId(client);
  await client.views.open({
    trigger_id: body.trigger_id,
    view: addToChannelView(channelId),
  });
};
module.exports = {
  inviteAppToChannelBtnHandler,
};
