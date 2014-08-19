'use strict';

var deckId;

// directive code for modal
angular.module('authTestApp')
    .controller('ModalWindowCtrl', function($scope, $http, $modal, $log, $templateCache) {

        $scope.cards = [];

        // open modal window
        $scope.open = function(deck, size) {
            var currentTime = new Date();
            deckId = deck._id;
            // get cards from selected deck
            $http.get('/api/decks/' + deckId)
                .success(function(data) {
                    console.log('Deck Info before splice: ', data.cards)

                    // check through cards in deck to see if display time has matched or passed
                    for (var i=0; i<data.cards.length; i++) {
                      // if current date-time matches or has passed nextDisplayTime in card object, pop from array
                      var parsedDateFromModel = Date.parse(data.cards[i].nextDisplayTime)

                      var parsedCurrentDate = Date.parse(currentTime);

                      console.log('nextDisplaytime',data.cards[i].nextDisplayTime);
                      console.log('currenttime', currentTime);

                      if (parsedDateFromModel > parsedCurrentDate) {
                        console.log('SUCCESS');
                        // remove from array
                        data.cards.splice(i ,1);
                        i--; // reset the incrementor
                      }
                    }

                    console.log('Deck after splice:', data.cards);

                    // set items array equal to cards
                    $scope.cards = data.cards;

                    var modalInstance = $modal.open({
                        templateUrl: 'app/modal_window/modal_window.html',
                        controller: ModalInstanceCtrl,
                        size: size,
                        resolve: {
                          cards: function() {
                              return $scope.cards;
                          }
                        }
                    });

                    // notify console when modal window dismissed
                    modalInstance.result.then(function(selectedItem) {
                        $scope.selected = selectedItem;
                    }, function() {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                });
        };
    });


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function($scope, $modalInstance, cards, $rootElement, $http, $timeout) {
    var show = false;
    var showWSB = false;
    var showCorrect = false;
    var showWrong = false;
    var final_transcript = '';

    // function to randomly shuffle card deck
    function shuffle(array) {
      var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }


    // config for web-speech API
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function() {
        alert("Say the answer clearly and slowly");
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
        };
        // add val of final_transcript to answer-input
        var answer_input = document.getElementById('answer-input');
        answer_input.value = final_transcript;
        $scope.card_answer.value = final_transcript;
        console.log('card_answer.value from recog.onresult: ', $scope.card_answer.value);
    };

    recognition.onend = function() {
        alert("Speech recognition ended");
    };


    $scope.cards = shuffle(cards);

    // initially, index is at first card
    $scope.currentIndex = 0;

    $scope.selected = {
        card: $scope.cards[$scope.currentIndex]
    };


    $scope.nextCard = function() {
        // increments index
        if ($scope.cards.length-1 > $scope.currentIndex) {
          $scope.currentIndex = 0;
        }
        $scope.cards[$scope.currentIndex].visible = true;

        showCorrect = false;
        showWrong = false;
        show = false;
        $scope.card_answer = {value: ''};
    };


    /* Set difficulty in the model to 'hard', 'medium' or 'easy' */
    $scope.setDifficulty = function(difficulty) {
        var nextDisplayDate = new Date();
        // if difficulty is hard, then keep displaying
        if (difficulty === 'hard') {
          nextDisplayDate = 0;
        }
        // add 15 minutes
        else if (difficulty === 'medium') {
          nextDisplayDate = nextDisplayDate.setMinutes(nextDisplayDate.getMinutes() + 15);
        }
        // add 24 hours
        else if (difficulty === 'easy') {
          nextDisplayDate = nextDisplayDate.setDate(nextDisplayDate.getDate() + 1);
        }
        var cardId_obj = {
            cardId: $scope.selected.card._id,
            difficulty: difficulty,
            nextDisplayTime: nextDisplayDate
        };
        // update 'difficulty' key in deck model
        $http.put('/api/decks/' + deckId + '/' + $scope.selected.card._id + '/updateCard', cardId_obj);

        if (difficulty !== 'hard') {
          if ($scope.cards.length > 0) {
            $scope.cards.splice($scope.currentIndex, 1);
          }
          $scope.selected.card = $scope.cards[$scope.currentIndex];
        }
        $scope.nextCard();
  };


    /* Allow webkitspeech */
    $scope.startWebSpeech = function(event) {
        recognition.lang = 'en-IN';
        final_transcript = '';
        recognition.start();
        console.log('web speech started');
        showWSB = true;
    };

    $scope.stopWebSpeech = function(event) {
        recognition.stop();
        showWSB = false;
    };

    $scope.showWebSpeechButton = function() {
        return showWSB;
    };

    $scope.showAnswer = function() {
        show = true;
    };

    $scope.hideAnswer = function() {
        show = false;
    };

    $scope.showButton = function() {
        return show;
    };

    $scope.card_answer = {value: ''};
    $scope.submitAnswer = function() {
        // if user input answer equals card answer, show 'Well Done!'
        if ($scope.card_answer.value === $scope.selected.card.answer) {
          showCorrect = true;
          showWrong = false;
        }
        // else show 'Try Again'
        else {
          showWrong = true;
          showCorrect = false;
        };
    };

    $scope.isCorrect = function() {
        return showCorrect;
    }

    $scope.isWrong = function() {
        return showWrong;
    }

    $scope.close = function() {
        $modalInstance.close($scope.selected.card);
    };
};