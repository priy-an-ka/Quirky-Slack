const feedbackBtnHandler = async ({ ack }) => {
  // Acknowledge the action

  await ack();
  // open website or something for feedback tbd
  // window.open('https://www.headout.com');
};

module.exports = { feedbackBtnHandler };
