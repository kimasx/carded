'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var User = require('../user/user.model.js');
var Deck = require('./deck.model')['Deck'];
var Card = require('./deck.model')['Card'];

exports.load = function(req,res,next,id) {
  Deck.findById(id,function(err,deck) {
    if(err) return next(err);
    if(!deck) return next(new Error('Deck not found'));
    req.deck = deck;
    next();
  });
};

// Get list of decks
exports.index = function(req, res) {
  Deck.find({'_creator': req.user._id}, function (err, decks) {
    if(err) { return handleError(res, err); }
    return res.json(200, decks);
  });
};

// Get a single deck
exports.show = function(req, res) {
  res.json(req.deck);
  // Deck.findById(req.params.id, function (err, deck) {
  //   if(err) { return handleError(res, err); }
  //   if(!deck) { return res.send(404); }
  //   return res.json(deck);
  // });
};

// Creates a new deck in the DB.
exports.create = function(req, res) {
  // find user by email and push deck into user's decks array
  User.findOne({'email': req.body.currentUser.email},function (err, user) {
    if(err) {return handleError(res, err);}
    if(!user) { return res.send(404); }

    // create deck, given info in req.body
    Deck.create({
      name: req.body.name,
      description: req.body.description,
      cards: req.body.cards,
      _creator: user._id}, function (err, deck)
      {
        deck.save(function(err)
        {
          if(err) return handleError(err);
        });

        // update user's decks array
        User.update({'email': req.body.currentUser.email}, {$push: {'decks': deck._id}}, function(err)
        {
            if(err) {return handleError(res, err);}
            return res.json({id: deck._id});
        });
      });
  });
};


// Adds a card to deck
exports.makenewCard = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    // push card obj into deck
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
  // find deck, then find card matching _id to cardId, then update difficulty
  Deck.update({_id: req.params.id, "cards._id": req.body.cardId}, {
    "cards.$.difficulty": req.body.difficulty,
    "cards.$.nextDisplayTime": req.body.nextDisplayTime},
    function (err) {
      if (err) { return handleError(res, err)};
      return res.send(200);
  });
};

// Edits a card in selected deck
exports.editCard = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  console.log(req.deck);
  Deck.update({_id: req.params.id, "cards._id": req.body.cardId}, {
    "cards.$.answer": req.body.answer,
    "cards.$.question": req.body.question},
    function (err, num, doc) {
      if (err) { return handleError(res, err)};
      console.log('THIS IS DOC: ', doc);
      //console.log(arguments);
      return res.send(200);
  });
}



// Deletes a deck from the DB.
exports.destroy = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    // remove from User.cards array
    User.find({'_id': deck._creator}, function(err, user) {
      // delete
      user[0].decks.pull(req.params.id);
      user[0].save(function(err) {

      });
    });

    // remove deck
    deck.remove(function(err) {
      if(err) { return handleError(res, err); }
    });
  return res.send(204);
  });
};

// Delete a card
exports.destroyCard = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    console.log('req body in delete button: ', req.body);
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