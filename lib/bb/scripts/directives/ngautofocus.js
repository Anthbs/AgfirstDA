'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:ngautofocus
 * @description
 * # ngautofocus
 */
angular.module('netLabApp')
    .directive('ngautofocus', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $timeout(function() {
                    //debugger;
                    $element[0].focus();
                }, 100);
            }
        }
    });
