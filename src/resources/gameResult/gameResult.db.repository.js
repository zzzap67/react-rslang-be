const GameResult = require('./gameResult.model');
const GameStats = require('./GameStats.model');
const userWords = require('../userWords/userWord.model');
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
  const resDayStats = {};
  const requestArr = [];
  const wordStatus = [];
  requestArr.push(gameResult);
  // console.log(requestArr);
  // console.log('pre start');
  for (item of requestArr) {
    await GameStats.findOne({ userId, dates: gameResult.dates }, async (err, res) => {
      if (res) {
        resDayStats.userId = userId;
        resDayStats.dates = res.dates;
        resDayStats.rightAC = res.rightAC;
        resDayStats.totalAC = res.totalAC;
        resDayStats.rightSprint = res.rightSprint;
        resDayStats.totalSprint = res.totalSprint;
        resDayStats.newWord = res.newWord;
        resDayStats.studiedWord = res.studiedWord;
        resDayStats.seriesAC = res.seriesAC;
        resDayStats.seriesSprint = res.seriesSprint;
      } else {
        resDayStats.userId = userId;
        resDayStats.dates = gameResult.dates;
        resDayStats.rightAC = 0;
        resDayStats.totalAC = 0;
        resDayStats.rightSprint = 0;
        resDayStats.totalSprint = 0;
        resDayStats.newWord = 0;
        resDayStats.studiedWord = 0;
        resDayStats.seriesAC = 0;
        resDayStats.seriesSprint = 0;
      }

      if (gameResult.gameName === 'Sprint') {
        if (gameResult.maxSeries > resDayStats.seriesSprint) {
          resDayStats.seriesSprint = gameResult.maxSeries;
        }
      } else {
        if (gameResult.maxSeries > resDayStats.seriesAC) {
          resDayStats.seriesAC = gameResult.maxSeries;
        }
      }
    });
    // console.log('pre end');
  }
  // console.log('start');
  // console.log(resDayStats);

  for (const item of arr) {
    await userWords.findOne(
      { userId, wordId: item.wordId },
      async (err, res) => {
        const uW = {};
        uW.wordId = item.wordId;
        uW.needRefresh = false;

        if (res) {
          uW.difficulty = res.difficulty;
        } else {
          uW.difficulty = 'easy';
        }

        wordStatus.push(uW);
      }
    )
  }

  // console.log(wordStatus);
  // console.log('start results');
  let currIndex = -1;
  for (const item of arr) {
    currIndex++;
    // console.log(currIndex);
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
        } else {
          resDayStats.newWord++;
        }

        if (gameResult.gameName === 'Sprint') {
          newResult.totalSprint++;
          resDayStats.totalSprint++;
          if (item.result === 1) {
            newResult.rightSprint++;
            resDayStats.rightSprint++;
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
          resDayStats.totalAC++;
          if (item.result === 1) {
            newResult.rightAC++;
            resDayStats.rightAC++;
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



        // difficulty change
        if (
          newResult.currResult === -1 &&
          wordStatus[currIndex].difficulty === 'studied'
        ) {
          wordStatus[currIndex].needRefresh = true;
          wordStatus[currIndex].difficulty = 'easy';
        } else if (
          newResult.currResult === 3 &&
          wordStatus[currIndex].difficulty === 'easy'
        ) {
          wordStatus[currIndex].needRefresh = true;
          wordStatus[currIndex].difficulty = 'studied';
          resDayStats.studiedWord++;
        } else if (
          newResult.currResult === 5 &&
          wordStatus[currIndex].difficulty === 'hard'
        ) {
          wordStatus[currIndex].needRefresh = true;
          wordStatus[currIndex].difficulty = 'studied';
          resDayStats.studiedWord++;
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

  // console.log(resDayStats)
  // console.log('refresh start');
  // console.log(wordStatus);
  for (item of wordStatus.filter((elem) => elem.needRefresh)) {
    await userWords.findOneAndUpdate(
      { userId, wordId: item.wordId },
      { $set: { difficulty: item.difficulty } },
      { upsert: true, new: true },
      (err, res) => {
        // console.log(res);
      }
    );
  }

  // console.log('refresh end');
  await GameStats.findOneAndUpdate(
    { userId, dates: gameResult.dates },
    { $set: resDayStats },
    { upsert: true, new: true },
    (err, res) => {
      // console.log(res);
    }
  );

  return resArrSend;
};

module.exports = { get, checkResult };
