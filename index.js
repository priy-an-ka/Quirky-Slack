require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');
const bodyParser = require('body-parser');
const {
  homeViewHandler, emojiGuessBtnHandler,
  emojiGuessModalSubmissionHandler, feedbackBtnHandler, homeEmojigameBtnHandler,
  channelGameHostModalHandler, triggerLettersGame,
  triggerEmojiGame, gameRefreshHandler, addAppToChannel, inviteAppToChannelBtnHandler,
  emojiGameShortcut, propagateTicker, lettersGameShortcut, homeLettersBtnHandler,
  lettersAnswerBtnHandler, lettersAnswerModalSubmissionHandler,
} = require('./handlers');

const {
  HOME_VIEW_HANDLER_EVENT_ID, FEEDBACK_BTN_HANDLER_ACTION_ID, HOME_EMOJI_BTN_HANDLER_ACTION_ID,
  HOME_LETTERS_BTN_HANDLER_ACTION_ID, TRIGGER_EMOJI_MODAL_CALLBACK_ID,
  TRIGGER_LETTERS_MODAL_CALLBACK_ID, HAPPY_HOURS_SLASH_COMMAND_ID,
  EMOJI_GUESS_BUTTON_ACTION_ID, EMOJI_GUESS_MODAL_SUBMISSION_CALLBACK_ID,
  INVITE_APP_TO_CHANNEL_ACTION_ID, ADD_APP_TO_CHANNEL_CALLBACK_ID, SHORTCUT_EMOJI_CALLBACK_ID,
  SHORTCUT_LETTERS_CALLBACK_ID, LETTERS_ANSWER_BUTTON_ACTION_ID,
  LETTERS_ANSWER_MODAL_SUBMISSION_CALLBACK_ID,
} = require('./constants');

const suffixCommand = (cmd) => {
  const envName = process.env.APP_ENV_NAME;
  return envName ? `${cmd}_${envName}` : cmd;
};

// Create a Bolt Receiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// Create the Bolt App, using the receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Listen for users opening App Home
app.event(HOME_VIEW_HANDLER_EVENT_ID, homeViewHandler);

// App home feedback button action
app.action(FEEDBACK_BTN_HANDLER_ACTION_ID, feedbackBtnHandler);

// App home Emoji game button action
app.action(HOME_EMOJI_BTN_HANDLER_ACTION_ID, homeEmojigameBtnHandler);

// App home Letters game button action
app.action(HOME_LETTERS_BTN_HANDLER_ACTION_ID, homeLettersBtnHandler);

// Emoji Game view in Channel
app.view(TRIGGER_EMOJI_MODAL_CALLBACK_ID, triggerEmojiGame);

// Letters Game view in Channel
app.view(TRIGGER_LETTERS_MODAL_CALLBACK_ID, triggerLettersGame);

// Slash commands for anything related to Happy Hours
app.command(suffixCommand(HAPPY_HOURS_SLASH_COMMAND_ID), channelGameHostModalHandler);

// Listen to clicks on Guess button: Emoji Game
app.action(EMOJI_GUESS_BUTTON_ACTION_ID, emojiGuessBtnHandler);

// Listens to Guess modal submissions: Emoji Game
app.view(EMOJI_GUESS_MODAL_SUBMISSION_CALLBACK_ID, emojiGuessModalSubmissionHandler);

// Listen to clicks on Guess button: Emoji Game
app.action(LETTERS_ANSWER_BUTTON_ACTION_ID, lettersAnswerBtnHandler);

// Listens to Guess modal submissions: Emoji Game
app.view(LETTERS_ANSWER_MODAL_SUBMISSION_CALLBACK_ID, lettersAnswerModalSubmissionHandler);

// Invite Happy Hours to any public channel from Home
app.action(INVITE_APP_TO_CHANNEL_ACTION_ID, inviteAppToChannelBtnHandler);

// View to add app to channel
app.view(ADD_APP_TO_CHANNEL_CALLBACK_ID, addAppToChannel);

// Shortcut for Emoji Game
app.shortcut(SHORTCUT_EMOJI_CALLBACK_ID, emojiGameShortcut);

// Shortcut for Letters Game
app.shortcut(SHORTCUT_LETTERS_CALLBACK_ID, lettersGameShortcut);

// Custom routes
// Not attaching this to receiver router directly as I'm not sure how it could affect slack routes
const jsonParser = bodyParser.json();

receiver.router.post('/refresh-game-state', jsonParser, async (req, res) => {
  const { gameId } = req.body;
  await gameRefreshHandler(gameId);
  await propagateTicker(gameId);
  res.send('ok');
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
