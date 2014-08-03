'use strict';

var _ = require('lodash');
var Deck = require('./deck.model')['Deck'];
var Card = require('./deck.model')['Card'];

// Get list of decks
exports.index = function(req, res) {
  Deck.find(function (err, decks) {
    if(err) { return handleError(res, err); }
    return res.json(200, decks);
  });
};

// Get a single deck
exports.show = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    return res.json(deck);
  });
};

// Creates a new deck in the DB.
exports.create = function(req, res) {
  Deck.create(req.body, function(err, deck) {
    if(err) { return handleError(res, err); }
    return res.json(201, deck);
  });
};

// Adds a card to deck
exports.makenewCard = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    // push card obj into deck
    console.log(req.body);
    deck.cards.push(req.body);
    deck.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deck);
    });
  });
}

// Updates an existing deck in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    var updated = _.merge(deck, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deck);
    });
  });
};

// Updates a card in the selected deck
exports.updateCard = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    // update difficulty level where id = req.body.cardId
    console.log('card id: ', req.body.cardId)
    console.log(Card);
    Card.findById(req.body.cardId, function(err, card) {
      if (err) { console.log(err); }
      else {
        console.log("Successful in finding card by id and update, now trying to find card by id");
        console.log(card);
      }
    });

  });
};

//   Card.findById(req.body.cardId, function(err, card) {
      //     if (err) { console.log(err); }
      //     else {
      //       console.log("successful in finding card by id");
      //       console.log(card);
      //     }
        // });



// Deletes a deck from the DB.
exports.destroy = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    deck.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Delete a card
exports.destroyCard = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    // find card within deck and delete
    deck.cards.pull({_id: req.params.cardId});
    deck.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}