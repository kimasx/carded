'use strict';

angular.module('authTestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        authenticate: true
      });
  });