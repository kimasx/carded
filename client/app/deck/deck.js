'use strict';

angular.module('authTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/deck/:name', {
        templateUrl: 'app/deck/deck.html',
        controller: 'DeckCtrl'
      });
  });
