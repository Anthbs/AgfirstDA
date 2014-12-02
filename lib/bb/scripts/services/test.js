'use strict';

/**
 * @ngdoc service
 * @name netLabApp.Test
 * @description
 * # Test
 * Provider in the netLabApp.
 */
angular.module('netLabApp')
    .provider('Test', function() {
        this.$get = function($resource) {

            var methods = $resource('http://192.168.16.162:8888/test/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });

            function Test(attributes) {
                this.$save = new methods().$save();
            }

            Test.query = methods.query;
            Test.get = methods.get;
            Test.update = methods.update;
            Test.delete = methods.delete;

            return Test;
        };
    });
