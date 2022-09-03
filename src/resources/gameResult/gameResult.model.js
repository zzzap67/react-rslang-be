const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const GameResultSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    wordId: {
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
    currResult: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { collection: 'gameResult' }
);

addMethods(GameResultSchema);

module.exports = mongoose.model('GameResult', GameResultSchema);
