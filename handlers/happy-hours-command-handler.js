const { helpView, emojiGameHostModal, lettersGameHostModal } = require('../views');
const { randomChannelId } = require('./utils');

const channelGameHostModalHandler = async ({
  ack, body, client, respond,
}) => {
  await ack();
  switch (body.text) {
    case 'emoji':
      if (body.channel_name === 'directmessage') {
        await client.views.open({
          trigger_id: body.trigger_id,
          view: emojiGameHostModal(await randomChannelId(client)),
        });
      } else {
        await client.views.open({
          trigger_id: body.trigger_id,
          view: emojiGameHostModal(body.channel_id),
        });
      }
      break;

    case 'letters':
      if (body.channel_name === 'directmessage') {
        await client.views.open({
          trigger_id: body.trigger_id,
          view: lettersGameHostModal(await randomChannelId(client)),
        });
      } else {
        await client.views.open({
          trigger_id: body.trigger_id,
          view: lettersGameHostModal(body.channel_id),
        });
      }

      break;
    default:
      await respond({
        blocks: helpView().blocks,
      });
  }
};

module.exports = {
  channelGameHostModalHandler,
};
