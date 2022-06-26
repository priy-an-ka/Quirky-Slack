const { emojiGameHostModal } = require('../views');

const emojiGameShortcut = async ({
  shortcut,
  ack, client,
}) => {
  await ack();

  await client.views.open({
    trigger_id: shortcut.trigger_id,
    view: emojiGameHostModal(),
  });
};
module.exports = {
  emojiGameShortcut,
};
