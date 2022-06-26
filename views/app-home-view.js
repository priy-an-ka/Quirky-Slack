const { homeViewGifs } = require('./utils');
const {
  HOME_EMOJI_BTN_HANDLER_ACTION_ID, HOME_LETTERS_BTN_HANDLER_ACTION_ID,
  HAPPY_HOURS_SLASH_COMMAND_ID, FEEDBACK_BTN_HANDLER_ACTION_ID,
  INVITE_APP_TO_CHANNEL_ACTION_ID,
} = require('../constants');

const homeView = (user) => (
  {
    type: 'home',
    blocks: [
      {
        type: 'image',
        title: {
          type: 'plain_text',
          text: ' ',
          emoji: true,
        },
        image_url: homeViewGifs(),
        alt_text: 'Work life',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey  <@${user}>! :wave: *Welcome to the world of Quirky* :heads-down: \n\n Quirky is all things eccentric and fun! Want to chill out with your teammates over Slack or just a power booster between long meetings, quirky is here to help!`,

        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: "*Let's dive in!*",
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ":dart: :heart_eyes: :clubs: :sunglasses: :golf: :smile: :game_die:  Yay! You're right! It's the *Emoji Game*\n\n Guess your favourite movies by emojis! :tada: \n\n Simple right:question: So, start playing and unveil the fun :blue_heart:",
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Emoji Game',
              emoji: true,
            },
            action_id: HOME_EMOJI_BTN_HANDLER_ACTION_ID,

          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*This is your show off time!*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':thinking_face: :eyes: :brain: All you need to do is think, observe and seek *The Bag Of Letters*\n\n Find out words from a set of alphabets, the longer the word, the more points you get :abcd:\n\n Time to swank your lexicon :sunglasses:',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Bag of Letters',
              emoji: true,
            },
            action_id: HOME_LETTERS_BTN_HANDLER_ACTION_ID,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: "Here's what more you can do!",
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: "To invite Quirky to a channel, submit the command *@Quirky* on the channel's chat or you can add it from here! ",
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Add to channel',
            emoji: true,
          },
          action_id: INVITE_APP_TO_CHANNEL_ACTION_ID,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `To know more about Quirky, hit up ${HAPPY_HOURS_SLASH_COMMAND_ID} help`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `To start a game, use the command ${HAPPY_HOURS_SLASH_COMMAND_ID} start`,
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Let us know if Quirky was fun! We would :heart: to :ear: back :love_letter:',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Feedback ',
            emoji: true,
          },
          action_id: FEEDBACK_BTN_HANDLER_ACTION_ID,
        },
      }],
  }

);

module.exports = {
  homeView,

};
