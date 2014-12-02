'use strict';

/**
 * @ngdoc service
 * @name netLabApp.BaseFSM
 * @description
 * # BaseFSM
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('BaseFSM', function($q, $rootScope, $log) {
        function FSM(type, initalState) {
            this.deferred = null;
            this.initialState = initalState;
            this.currentState = null;
            this.states = {};
            this.type = type;
        }

        FSM.prototype.changeState = function(state, params) {

            if (params && params.promise) {
                //$log.fsm(this.type + ": " + $rootScope.clone(this.currentState) + " --> WAITING");
                params.promise.then(function(pResult) {
                    this.changeState(pResult.nextState, pResult.params);
                }.bind(this));
            } else {
                $log.fsm(this.type + ": " + $rootScope.clone(this.currentState) + " --> " + state + " Params: ", $rootScope.clone(params));
                this.currentState = state;
                var result = this.states[this.currentState](params);

                if (result.promise) {
                    this.changeState(null, result.promise);
                } else if (!result.end && result.nextState) {
                    this.changeState(result.nextState, result.params);
                } else if (result.end) {
                    $log.fsm(this.type + ": END --> Params: ", $rootScope.clone(result.params));
                    this.deferred.resolve(result.params);
                } else {
                    this.deferred.resolve(params);
                }
            }
        };

        FSM.prototype.addState = function(state_name, func) {
            this.states[state_name] = function(params) {
                return func(params);
            };
        };

        FSM.prototype.start = function(params) {
            this.deferred = $q.defer();
            this.changeState(this.initialState, params);
            return this.deferred.promise;
        };

        return FSM;
    });
