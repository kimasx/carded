'use strict';

var express = require('express');
var controller = require('./deck.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/newCard', controller.makenewCard);
router.put('/:id', controller.update);
router.put('/:id/:cardId/updateCard', controller.updateCard);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/:id/:cardId/deleteCard', controller.destroyCard);


module.exports = router;