const gameStatsRepo = require('./gameStats.db.repository');

const get = async userId => gameStatsRepo.get(userId);

module.exports = { get };
