'use strict';

angular.module('authTestApp')
  .controller('HomeCtrl', function($scope, Auth, $http, $location) {

    $http.get('/api/decks')
      .success(function(data) {
        console.log(data);
        $scope.items = data;
      });

    $scope.startAdd = function() {
      $scope.newItem = { name: '', description: '' };
      $scope.adding = true;
    }

    $scope.items = [];
    $scope.addItem = function(deck) {
      $scope.adding = false;
      var newItem = angular.copy($scope.newItem);
      newItem.description = newItem.description.replace(/\n/g, '<br>');
      newItem.description = "<p>" + newItem.description + "</p>";
      $scope.items.push(newItem);
      $http.post('/api/decks', newItem);
    };

  $scope.cancelAdd = function() {
    $scope.adding = false;
  };
});