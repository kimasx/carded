'use strict';

angular.module('authTestApp')
  .controller('DeckCtrl', function ($scope, $routeParams, $http) {
    $scope.name = $routeParams.name;
    $scope._id = $routeParams._id;


    $http.get('/api/decks/' + $scope._id)
      .success(function(data) {
        console.log(data.cards);
        $scope.cards = data.cards;
        $scope.deck = data;
      });

    $scope.cards = [];

    /* ADD Card */
    $scope.startAddCard = function() {
      $scope.newCard = { question: '', answer: '', difficulty: 'hard', nextDisplayTime: 0};
      $scope.adding = true;
    }

    $scope.addCard = function() {
      $scope.adding = false;
      var newCard = angular.copy($scope.newCard);
      // put card obj into deck
      $http.post('api/decks/'+ $scope._id + '/newCard', newCard).success(function(deck) {
          $scope.cards.push(deck.cards[deck.cards.length-1]);
      })
    }

    $scope.cancelAddCard = function() {
      $scope.adding = false;
    };


    /* EDIT Card */
    $scope.startEditCard = function(card, $index) {
      $scope.editing = true;
      $scope.cardId = card._id;
      $scope.editingCard = {cardId: $scope.cardId, question: card.question, answer: card.answer, index: $index}
    }

    $scope.editCard = function() {
      $scope.editing = false;
      console.log('cardId in editCard', $scope.cardId)
      $http.put('/api/decks/' + $scope._id + '/' + $scope.cardId + '/editCard', $scope.editingCard).success(function() {
        $scope.cards[$scope.editingCard.index].answer = $scope.editingCard.answer;
        $scope.cards[$scope.editingCard.index].question = $scope.editingCard.question;
      });
    }

    $scope.cancelEditCard = function() {
      $scope.editing = false;
    }

    $scope.deleteCard = function(card, $index) {
      var cardId = card._id;
      var ans = confirm('Are you sure you want to delete this card?');
      if (ans == true)
      {
         //remove from model
         $http.delete('/api/decks/' + $scope._id + '/' + cardId + '/deleteCard');
        // remove from view
        $scope.cards.splice($index,1)
      }
    };
  });
