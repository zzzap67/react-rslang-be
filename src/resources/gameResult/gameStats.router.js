const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const gameStatsService = require('./gameStats.service');
const { gameStats } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');

router.get('/', async (req, res) => {
  const gameStats = await gameStatsService.get(req.userId);
  res.status(OK).send(gameStats);
});

module.exports = router;
