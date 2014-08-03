'use strict';

angular.module('authTestApp')
  .controller('HomeCtrl', function($scope, $http) {

    $http.get('/api/decks')
      .success(function(data) {
        console.log(data);
        $scope.items = data;
      });

    $scope.startAdd = function() {
      $scope.newItem = { name: '', description: '', cards: []};
      $scope.adding = true;
    }

    $scope.items = [];
    $scope.addItem = function() {
      $scope.adding = false;
      var newItem = angular.copy($scope.newItem);
      newItem.description = newItem.description.replace(/\n/g, '<br>');
      newItem.description = "<p>" + newItem.description + "</p>";
      $scope.items.push(newItem);
      $http.post('/api/decks', newItem);
    };

    $scope.deleteItem = function(item, $index) {
      var itemId = item._id;
      console.log('itemId', itemId);
      var ans = confirm('Are you sure you want to delete this deck?');
      if (ans == true)
      {
        // remove from model
        $http.delete('/api/decks/' + itemId, item);
        // remove from view
        $scope.items.splice($index,1)
      }
    };

    $scope.cancelAdd = function() {
      $scope.adding = false;
    };
});