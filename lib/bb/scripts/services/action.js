'use strict';

/**
 * @ngdoc service
 * @name netLabApp.Action
 * @description
 * # Action
 * Provider in the netLabApp.
 */
angular.module('netLabApp')
    .provider('Action', function() {

        this.$get = function($resource) {

            var methods = $resource('http://192.168.16.162:8888/action/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            function Action(attributes) {
                this.$save = new methods().$save();
            }

            Action.query = methods.query;
            Action.get = methods.get;
            Action.update = methods.update;
            Action.delete = methods.delete;

            return Action;
        };
    });
