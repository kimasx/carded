'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardSchema = new Schema({
  question: String,
  answer: String,
  correct: Boolean,
  difficulty: String
});

var DeckSchema = new Schema({
  name: String,
  description: String,
  cards: [CardSchema]
});

module.exports = {
  'Card': mongoose.model('Card', CardSchema),
  'Deck': mongoose.model('Deck', DeckSchema)
}
