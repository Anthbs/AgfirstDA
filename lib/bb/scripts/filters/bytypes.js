'use strict';

/**
 * @ngdoc filter
 * @name netLabApp.filter:byTypes
 * @function
 * @description
 * # byTypes
 * Filter in the netLabApp.
 */
angular.module('netLabApp')
    .filter('byTypes', function() {
        return function(states, typesString) {
            var types = typesString.split(',');
            var out = states.filter(function(state) {
                return types.some(function(type) {
                    return type == state.type;
                });
            });
            return out;
        }
    });
