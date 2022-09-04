const GameStats = require('./gameStats.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async userId => {
  const gameResult = await GameStats.find({ userId }).sort({ dates: 1 });
  if (!gameResult) {
    throw new NOT_FOUND_ERROR('gameResult', `userId: ${userId}`);
  }

  return gameResult;
};

module.exports = { get };
