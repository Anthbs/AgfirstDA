'use strict';

/**
 * @ngdoc service
 * @name netLabApp.StateMachine
 * @description
 * # StateMachine
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('StateMachine', function($q, StorageService, Test) {
        function LoadTest(testID) {
            var deferred = $q.defer();

            //Load from api
            Test.get({
                id: testID
            }).$promise.then(function(test) {
                if (test != null && test.id != null) {
                    deferred.resolve(test);
                } else {
                    //Load from localstorage
                    var Tests = StorageService.get("BYOTests");
                    if (Tests != null && Tests.length > 0) {
                        var t = Tests.find(function(test) {
                            return test.id == name;
                        });
                        deferred.resolve(t);
                    } else {
                        console.log("Test Not Found: " + testID);
                        deferred.resolve();
                    }
                }
            });

            return deferred.promise;
        }

        function StateMachine(name, params) {
            var deferred = $q.defer();

            LoadTest(name).then(function(test) {
                if (test != null && test.id != null) {
                    if (params == null) {
                        params = {};
                    }
                    var res = eval(test.code); //Makes code runnable
                    var SM = new res();
                    deferred.resolve(SM.FSM.go(params));
                }
            });

            return deferred.promise;
        }

        function NewSM(name, params) {
            return new StateMachine(name, params);
        }

        return NewSM;
    });
