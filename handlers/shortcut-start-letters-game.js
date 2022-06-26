const { lettersGameHostModal } = require('../views');

const lettersGameShortcut = async ({
  shortcut,
  ack, client,
}) => {
  await ack();
  await client.views.open({
    trigger_id: shortcut.trigger_id,
    view: lettersGameHostModal(),
  });
};
module.exports = {
  lettersGameShortcut,
};
