'use strict';

angular.module('authTestApp')
  .controller('DeckCtrl', function ($scope, $routeParams) {
    $scope.message = 'Hello';
    $scope.name = $routeParams.name;
  });
