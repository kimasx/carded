'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  question: String,
  answer: String,
  correct: Boolean,
  difficulty: String,
  //timeDisplayed: Date,
  nextDisplayTime: Date
});

var DeckSchema = new Schema({
  name: String,
  description: String,
  cards: [CardSchema],
  _creator: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = {
  'Card': mongoose.model('Card', CardSchema),
  'Deck': mongoose.model('Deck', DeckSchema)
}
