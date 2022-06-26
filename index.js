const attemptDB = require('./attempt-db');
const gameDB = require('./game-db');
const questionDB = require('./question-db');

module.exports = {
  ...attemptDB,
  ...gameDB,
  ...questionDB,
};
