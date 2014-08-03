'use strict';

var deckId;

// directive code for modal
angular.module('authTestApp')
  .controller('ModalWindowCtrl', function($scope, $http, $modal, $log, $templateCache) {

      $scope.cards = [];

      // open modal window
      $scope.open = function (deck, size) {
        deckId = deck._id;
        // get cards from selected deck
        $http.get('/api/decks/' + deckId)
          .success(function(data) {
            // set items array equal to cards
            $scope.cards = data.cards;
            var modalInstance = $modal.open({
              templateUrl: 'app/modal_window/modal_window.html',
              controller: ModalInstanceCtrl,
              size: size,
              resolve: {
                cards: function () {
                  return $scope.cards;
                }
              }
            });

            // notify console when modal window dismissed
            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        });
      };
});


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($scope, $modalInstance, cards, $rootElement, $http) {
  var show = false;
  var showWSB = false;
  var final_transcript = '';

  // config for web-speech API
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
    console.log("Voice recognition started");
  };
  recognition.onresult = function(event) {
    var interim_transcript = '';
    console.log("onresult even handler", event.results);
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    // add val of final_transcript to answer-input
    var answer_input = document.getElementById('answer-input');
    answer_input.value = final_transcript;
  };
  recognition.onend = function() {
    alert("Speech recognition ended");
  };


  $scope.cards = cards;

  // initially, index is at first card
  $scope.currentIndex = 0;

  $scope.selected = {
    card: $scope.cards[0]
  };

  $scope.nextCard = function() {
    // increments index
    $scope.currentIndex < $scope.cards.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
    $scope.selected.card = $scope.cards[$scope.currentIndex];
  };

  $scope.prevCard = function() {
    // decrements index
    $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.cards.length - 1;
    $scope.selected.card = $scope.cards[$scope.currentIndex];
  };

  // watch to detect when currentIndex changes
  $scope.$watch('currentIndex', function() {
    $scope.cards.forEach(function(card) {
      card.visible = false; // make every card invisible
    });

    $scope.cards[$scope.currentIndex].visible = true; // make the current card visible
  });

  /* Set difficulty in the model to 'hard', 'medium' or 'easy' */
  $scope.setDifficulty = function(difficulty) {
    var cardId_obj = {
      cardId: $scope.selected.card._id,
      difficulty: difficulty
    };
    console.log('deck id: ', deckId);
    console.log('cardId obj: ', cardId_obj);
    $http.put('/api/decks/' + deckId + '/' + $scope.selected.card._id + '/updateCard', cardId_obj);

  }

  /* Allow webkitspeech */
 $scope.startWebSpeech = function(event) {
    recognition.lang = 'en-IN';
    final_transcript = '';
    recognition.start();
    showWSB = true;
  }

  $scope.stopWebSpeech = function(event) {
    recognition.stop();
    showWSB = false;
  }

  $scope.showWebSpeechButton = function() {
    return showWSB;
  }

  $scope.showAnswer = function() {
    show = true;
  };

  $scope.hideAnswer = function() {
    show = false;
  }

  $scope.showButton = function() {
    return show;
  }

  $scope.close = function () {
    $modalInstance.close($scope.selected.card);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

