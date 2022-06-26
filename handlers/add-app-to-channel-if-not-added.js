const { introduceBotView } = require('../views');
const { CHANNEL_BLOCK_ID, CHANNEL_ACTION_ID } = require('../constants');

const addAppToChannel = async ({
  body, ack, client,
}) => {
  await ack();
  /* eslint max-len: ["error", { "code": 105 }] */
  const channelId = body.view.state.values[CHANNEL_BLOCK_ID][CHANNEL_ACTION_ID].selected_conversation;
  const response = await client.conversations.join(
    {
      channelId,
    },
  );

  if ('warning' in response && response.warning.localeCompare('already_in_channel') === 0) {
    await client.chat.postEphemeral({
      channel: channelId,
      user: body.user.id,
      text: `Hey <@${body.user.id}>, I'm already in this channel. 
             If you need some assistance here, hit /help!`,
    });
  } else {
    await client.chat.postMessage({
      channel: channelId,
      blocks: introduceBotView(body.user.id).blocks,
    });
  }
};
module.exports = {
  addAppToChannel,
};
