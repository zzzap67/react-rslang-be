const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const gameResultService = require('./gameResult.service');
const { gameResult } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');

router.get('/', async (req, res) => {
  const gameResult = await gameResultService.get(req.userId);
  res.status(OK).send(gameResult);
});

router.post('/', async (req, res) => {
  // console.log('test');
  // console.log(req.userId);
  // console.log(req.body.gameName);
  // console.log(req.body.results);
  // res.status(OK).send('ok');
  const gameResult = await gameResultService.checkResult(req.userId, req.body);
  res.status(OK).send(gameResult);
});

module.exports = router;
