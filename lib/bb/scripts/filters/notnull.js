'use strict';

/**
 * @ngdoc filter
 * @name netLabApp.filter:notNull
 * @function
 * @description
 * # notNull
 * Filter in the netLabApp.
 */
angular.module('netLabApp')
    .filter('notNull', function() {
        return function(objs, field) {
            if (objs == null) {
                return null;
            }
            var out = objs.filter(function(obj) {
                return obj[field] != null && obj[field] != "";
            });
            return out;
        }
    });
