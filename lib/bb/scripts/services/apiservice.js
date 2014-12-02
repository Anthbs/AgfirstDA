'use strict';

/**
 * @ngdoc service
 * @name netLabApp.APIService
 * @description
 * # APIService
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('APIService', function($q, $http) {
        this.uri = "http://192.168.16.162:8888/";

        this.SaveTest = function(name, d) {
            var deferred = $q.defer();
            var data = angular.copy(d);

            //Fix circular references
            data.actions.forEach(function(action) {
                if (action.params != null && action.params.nextAction != null) {
                    action.params.nextAction = {
                        id: action.params.nextAction.id,
                        type: action.params.nextAction.type
                    };
                }
                if (action.params != null && action.params.repeatAction != null) {
                    action.params.repeatAction = {
                        id: action.params.repeatAction.id,
                        type: action.params.repeatAction.type
                    };
                }
                if (action.params != null && action.params.cancelAction != null) {
                    action.params.cancelAction = {
                        id: action.params.cancelAction.id,
                        type: action.params.cancelAction.type
                    };
                }
                if (action.params != null && action.params.errorAction != null) {
                    action.params.errorAction = {
                        id: action.params.errorAction.id,
                        type: action.params.errorAction.type
                    };
                }
                if (action.params != null && action.params.failedAction != null) {
                    action.params.failedAction = {
                        id: action.params.failedAction.id,
                        type: action.params.failedAction.type
                    };
                }
            });
            var d = JSON.stringify(data);
            $http.post(this.uri + "test/" + name, d).success(function(result) {
                console.log(result);
                deferred.resolve(result);
            }).error(function() {
                deferred.resolve(null);
            });
            return deferred.promise;
        }.bind(this);

        this.LoadTest = function(name) {
            var deferred = $q.defer();
            $http.get(this.uri + "test/" + name).success(function(test) {
                if (test != null) {
                    //Reattach Circular references
                    test.actions.forEach(function(action) {
                        if (action.params != null && action.params.nextAction != null) {
                            action.params.nextAction = test.actions.find(function(a) {
                                return a.id == action.params.nextAction.id;
                            });
                        }
                        if (action.params != null && action.params.repeatAction != null) {
                            action.params.repeatAction = test.actions.find(function(a) {
                                return a.id == action.params.repeatAction.id;
                            });
                        }
                        if (action.params != null && action.params.cancelAction != null) {
                            action.params.cancelAction = test.actions.find(function(a) {
                                return a.id == action.params.cancelAction.id;
                            });
                        }
                        if (action.params != null && action.params.errorAction != null) {
                            action.params.errorAction = test.actions.find(function(a) {
                                return a.id == action.params.errorAction.id;
                            });
                        }
                        if (action.params != null && action.params.failedAction != null) {
                            action.params.failedAction = test.actions.find(function(a) {
                                return a.id == action.params.failedAction.id;
                            });
                        }
                    });
                    deferred.resolve(test);
                } else {
                    deferred.resolve(null);
                }
            }).error(function() {
                deferred.resolve(null);
            });
            return deferred.promise;
        }

        this.LoadTests = function(name) {
            var deferred = $q.defer();
            $http.get(this.uri + "test/loadall/").success(function(result) {
                if (result.success == true) {
                    deferred.resolve(JSON.parse(result.tests));
                } else {
                    deferred.resolve([]);
                }
            }).error(function() {
                deferred.resolve([]);
            });
            return deferred.promise;
        }

        this.SaveAction = function(name, d) {
            var deferred = $q.defer();



            $http.post(this.uri + "action/save/" + name, d).success(function(result) {
                console.log(result);
                deferred.resolve(result);
            }).error(function() {
                deferred.resolve(null);
            });
            return deferred.promise;
        }.bind(this);

        this.LoadActions = function(name) {
            var deferred = $q.defer();
            $http.get(this.uri + "action/loadall/").success(function(result) {
                if (result.success == true) {
                    deferred.resolve(JSON.parse(result.tests));
                } else {
                    deferred.resolve([]);
                }
            }).error(function() {
                deferred.resolve([]);
            });
            return deferred.promise;
        }

        return this;
    });
