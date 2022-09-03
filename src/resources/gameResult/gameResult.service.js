const gameResultRepo = require('./gameResult.db.repository');

const get = async userId => gameResultRepo.get(userId);

const checkResult = async (userId, gameResult) =>
  gameResultRepo.checkResult(userId, { ...gameResult, userId });

module.exports = { get, checkResult };
