const { CHANNEL_DROPDOWN_DEFAULT } = require('../constants');

/**
 * groupBy
 *
 * For ex: arr = [{gen: "M", name: "Nish"}, {gen: "F", name: "Pingu"},
 *                {gen: "F", name: "Jacinda"}, {gen: "M", name: "Obama"}]
 * .groupBy(arr, (x) => x.gen, (x) => x.name)
 * output: {"M": ["Nish", "Obama"], "F": ["Pingu", "Jacinda"]}
 *
 */
const groupBy = (arr, keyTransformFn = (x) => x, valueTransformFn = (x) => x) => {
  const map = {};
  arr.forEach((el) => {
    const key = keyTransformFn(el);
    const value = valueTransformFn(el);

    if (key in map) {
      map[key].push(value);
    } else {
      map[key] = [value];
    }
  });

  return map;
};

/**
 * associate
 *
 * For ex: arr = [{gen: "M", name: "Nish"}, {gen: "F", name: "Pingu"},
 *                {gen: "F", name: "Jacinda"}, {gen: "M", name: "Obama"}]
 * .associate(arr, (x) => x.name, (x) => x.gen)
 * output: {"Nish": "M", "Pingu": "F", "Obama": "M", "Jacinda": "F"}
 *
 */
const associate = (arr, keyTransformFn = (x) => x, valueTransformFn = (x) => x) => {
  const map = {};
  arr.forEach((el) => {
    const key = keyTransformFn(el);
    const value = valueTransformFn(el);
    map[key] = value;
  });

  return map;
};

/**
 * groupSumBy
 *
 * For ex: arr = [{gen: "M", score: 2}, {gen: "F", score: 3}, {gen: "F", score: 4}]
 * .groupSumBy(arr, (x) => x.gen, (x) => x.score)
 * output: {"M": 2, "F": 7}
 *
 */
const groupSumBy = (arr, keyTransformFn = (x) => x, valueTransformFn = (x) => x) => {
  const map = {};
  arr.forEach((el) => {
    const key = keyTransformFn(el);

    if (key in map) {
      map[key] += valueTransformFn(el);
    } else {
      map[key] = valueTransformFn(el);
    }
  });

  return map;
};

/**
 * countBy
 *
 * For ex: arr = [{gen: "M", name: "Nish"}, {gen: "F", name: "Pingu"}, {gen: "F", name: "Jacinda"}]
 * .countBy(arr, (x) => x.gen)
 * output: {"M": 1, "F": 2}
 *
 */
const countBy = (arr, keyTransformFn = (x) => x) => groupSumBy(arr, keyTransformFn, () => 1);

/**
 * calculatePodiumUserScoreList
 *
 * Input: array of attempt objects - {gameId: "..", "slackUserId": "...", isCorrect: true/false}
 * Assumption: Input is all correct answers
 *
 * Returns users group by score sorted by score, limit top 3 scores
 * By default, 1 correct attempt is considered as 1 point score
 * This can be overriden by passing a scoring function
 *
 * Eg:
 * {
 *  6: ["user45", "user122"],
 *  5: ["user12", "user454"],
 *  ...
 * }
 *
 */
const calculatePodiumUserScoreList = (correctAns, scoreFn = () => 1) => {
  const scoreByUserId = groupSumBy(correctAns, (a) => a.slackUserId, scoreFn);
  const scoreUserIdSortedList = Object.entries(
    groupBy(
      Object.entries(scoreByUserId),
      ([, score]) => score,
      ([slackUserId]) => slackUserId,
    ),
  ).map(([score, slackUserIds]) => ({ score, slackUserIds }))
    .sort((a, b) => b.score - a.score);

  return scoreUserIdSortedList.slice(0, 3);
};

/**
 * Takes in an array of arrays [[char, int], ..]
 * Repeats an array of characters, by repeating characted by the integer number of times
 * Eg: [[a,2],[e,5],[j,1]] => [a,a,e,e,e,e,e,j]
 */
const distribute = (arr) => arr.reduce((acc, [letter, times]) => {
  acc.push(...letter.repeat(times));
  return acc;
}, []);

const sortByCreatedOnAsc = (g1, g2) => new Date(g1._createdOn) - new Date(g2._createdOn);
const sortByAnswerLength = (a, b) => b.value.length - a.value.length;

async function randomChannelId(client) {
  const result = await client.conversations.list();
  return result.channels.find((channel) => channel.name === CHANNEL_DROPDOWN_DEFAULT).id;
}

module.exports = {
  groupBy,
  associate,
  countBy,
  calculatePodiumUserScoreList,
  sortByCreatedOnAsc,
  sortByAnswerLength,
  randomChannelId,
  distribute,
};
