'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
