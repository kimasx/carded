'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Card = mongoose.model('Card');

var DeckSchema = new Schema({
  name: String,
  description: String,
  cards: [Card]
});

module.exports = mongoose.model('Deck', DeckSchema);