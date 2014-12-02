'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:ngEnter
 * @description
 * # ngEnter - calls function on enter pressed
 */
angular.module('netLabApp')
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
