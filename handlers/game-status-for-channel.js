const db = require('../db');

async function validateGameRunningInChannel(client, location, hostID) {
  const channelStatus = await db.getGameStatusForChannel(location);
  if (channelStatus.length > 0) {
    await client.chat.postEphemeral({
      channel: location,
      user: hostID,
      text: `Oops, <@${hostID}>! There's already a game running in this channel!`,
    });
    return true;
  }
  return false;
}
module.exports = {
  validateGameRunningInChannel,
};
