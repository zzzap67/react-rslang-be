const GameResult = require('./gameResult.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async userId => {
  const gameResult = await GameResult.find({ userId });
  if (!gameResult) {
    throw new NOT_FOUND_ERROR('gameResult', `userId: ${userId}`);
  }

  return gameResult;
};

const checkResult = async (userId, gameResult) => {
  const arr = gameResult.results;
  const resArrSend = [];

  for (const item of arr) {
    await GameResult.findOne(
      { userId, wordId: item.wordId },
      async (err, res) => {
        const newResult = {};
        newResult.userId = userId;
        newResult.wordId = item.wordId;
        newResult.rightAC = 0;
        newResult.totalAC = 0;
        newResult.rightSprint = 0;
        newResult.totalSprint = 0;
        newResult.currResult = 0;

        if (res) {
          newResult.rightAC = res.rightAC;
          newResult.totalAC = res.totalAC;
          newResult.rightSprint = res.rightSprint;
          newResult.totalSprint = res.totalSprint;
          newResult.currResult = res.currResult;
        }

        if (gameResult.gameName === 'Sprint') {
          newResult.totalSprint++;
          if (item.result === 1) {
            newResult.rightSprint++;
            if (newResult.currResult <= 0) {
              newResult.currResult = 1;
            } else {
              newResult.currResult++;
            }
          } else if (newResult.currResult > 0) {
            newResult.currResult = -1;
          } else {
            newResult.currResult--;
          }
        } else {
          newResult.totalAC++;
          if (item.result === 1) {
            newResult.rightAC++;
            if (newResult.currResult <= 0) {
              newResult.currResult = 1;
            } else {
              newResult.currResult++;
            }
          } else if (newResult.currResult > 0) {
            newResult.currResult = -1;
          } else {
            newResult.currResult--;
          }
        }
        resArrSend.push(newResult);
      }
    );
  }

  for (item of resArrSend) {
    await GameResult.findOneAndUpdate(
      { userId, wordId: item.wordId },
      { $set: item },
      { upsert: true, new: true },
      (err, res) => {
        // console.log(res);
      }
    );
  }

  return resArrSend;
};

module.exports = { get, checkResult };
