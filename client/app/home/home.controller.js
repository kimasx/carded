'use strict';

angular.module('authTestApp')
  .controller('HomeCtrl', function($scope, $http, Auth) {

    var current_user = Auth.getCurrentUser();
    // console.log('current user:', current_user);
    Auth.getCurrentUser().$get(function(){
    $http.get('/api/decks/')
      .success(function(data) {
        console.log('data: ', data);
        $scope.items = data;
      });
    });

    $scope.startAdd = function() {
      $scope.newItem = { name: '', description: '', cards: [], currentUser: current_user};
      $scope.adding = true;
    }

    $scope.items = [];
    $scope.addItem = function() {
      $scope.adding = false;
      var newItem = angular.copy($scope.newItem);
      newItem.description = newItem.description.replace(/\n/g, '<br>');
      newItem.description = "<p>" + newItem.description + "</p>";
      $http.post('/api/decks', newItem).success(function(deck_id){
        var newdeckId = deck_id.id;
        newItem._id = newdeckId;
        $scope.items.push(newItem);
      });
    };

    $scope.deleteItem = function(item, $index) {
      console.log('item:',item);
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