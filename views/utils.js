const getMedalEmoji = (rank) => {
  switch (rank) {
    case 1:
      return ':first_place_medal:';
    case 2:
      return ':second_place_medal:';
    case 3:
      return ':third_place_medal:';
    default:
      return ':sports_medal:';
  }
};

const userTagList = (slackUserIds) => slackUserIds.map((u) => `<@${u}>`).join();

function homeViewGifs() {
  return 'https://media.giphy.com/media/W5mN3Y6zGibdKYaE7g/giphy.gif';
}

function pickRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function gifWhenPodiumHasWinners() {
  const podiumWinnersArray = [
    'https://media.giphy.com/media/kdQuvu0LtCEjxYgTcS/giphy.gif',
    'https://media.giphy.com/media/YRuFixSNWFVcXaxpmX/giphy.gif',
    'https://media.giphy.com/media/8nogu0cIIVYT7jtGjN/giphy.gif',
  ];

  return pickRandomItem(podiumWinnersArray);
}
function gifWhenPodiumHasNoWinners() {
  const podiumNoWinnersArray = [
    'https://media.giphy.com/media/3oEjHChKVxgKFLM2ty/giphy.gif',
    'https://media.giphy.com/media/T1WqKkLY753dZghbu6/giphy.gif',
    'https://media.giphy.com/media/xT0xeuOy2Fcl9vDGiA/giphy.gif',
  ];

  return pickRandomItem(podiumNoWinnersArray);
}
function gifWhenGameMissed() {
  const missedGameArray = [
    'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
    'https://media.giphy.com/media/BLJy2x6QwzgdrCfAlD/giphy.gif',
    'https://media.giphy.com/media/X6xGbmJovn884DmLQr/giphy.gif',
  ];

  return pickRandomItem(missedGameArray);
}

const roundToClosestMultipleOfFive = (s) => Math.round(s / 5) * 5;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const batchArray = (arr, maxSize) => {
  const result = [];
  let currBatch = [];
  let currentCount = 0;
  for (let i = 0; i < arr.length; i += 1) {
    const element = arr[i];
    if (currentCount < maxSize) {
      currBatch.push(element);
      currentCount += 1;
    } else {
      result.push(currBatch);
      currBatch = [element];
      currentCount = 1;
    }
  }

  if (currBatch.length > 0) {
    result.push(currBatch);
  }

  return result;
};

module.exports = {
  pickRandomItem,
  getMedalEmoji,
  userTagList,
  homeViewGifs,
  gifWhenPodiumHasWinners,
  gifWhenPodiumHasNoWinners,
  gifWhenGameMissed,
  roundToClosestMultipleOfFive,
  batchArray,
  capitalize,
};
