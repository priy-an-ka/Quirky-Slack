const { homeView } = require('../views');

const homeViewHandler = async ({ payload, client }) => {
  // Call the views.publish method using the WebClient passed to listeners
  await client.views.publish({
    user_id: payload.user,
    view: homeView(payload.user),
  });
};
module.exports = {
  homeViewHandler,
};
