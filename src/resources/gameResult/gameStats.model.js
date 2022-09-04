const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const GameStatsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    dates: {
      type: String,
      required: true
    },
    rightAC: {
      type: Number,
      required: true,
      default: 0
    },
    totalAC: {
      type: Number,
      required: true,
      default: 0
    },
    rightSprint: {
      type: Number,
      required: true,
      default: 0
    },
    totalSprint: {
      type: Number,
      required: true,
      default: 0
    },
    newWordAC: {
      type: Number,
      required: true,
      default: 0
    },
    newWordSprint: {
      type: Number,
      required: true,
      default: 0
    },
    studiedWord: {
      type: Number,
      required: true,
      default: 0
    },
    seriesAC: {
      type: Number,
      required: true,
      default: 0
    },
    seriesSprint: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { collection: 'gameStats' }
);

addMethods(GameStatsSchema);

module.exports = mongoose.model('GameStats', GameStatsSchema);
