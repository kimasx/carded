'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  question: String,
  answer: String,
  correct: Boolean,
  score: String
});

module.exports = mongoose.model('Card', CardSchema);