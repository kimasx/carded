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

    $scope.startAddCard = function() {
      $scope.newCard = { question: '', answer: '', difficulty: 'hard'};
      $scope.adding = true;
      console.log($scope.name);
    }

    $scope.addCard = function() {
      $scope.adding = false;
      var newCard = angular.copy($scope.newCard);
      $scope.cards.push(newCard);
      // put card obj into deck
      $http.post('api/decks/'+ $scope._id + '/newCard', newCard);
    }

    $scope.cancelAddCard = function() {
      $scope.adding = false;
    };

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
