/**
 * @ngdoc function
 * @name netLabApp.controller:TestsCtrl
 * @description
 * # TestsCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('TestsCtrl', function($scope, $log, $http, Test, APIService, $injector) {
        var LoadAllTests = function() {
            return Test.query().$promise.then(function(tests) {
                $log.debug("LoadAllTests - Loaded {test_count} Tests".assign({
                    test_count: tests.length
                }));
                Tests.AvailableTests = tests.map(function(test) {
                    test.actions = test.actions.map(function(action) {
                        action.params = JSON.parse(action.params);
                        return action;
                    });
                    MakeRunnable(test);
                    return test;
                });
            });
        }

        var MakeRunnable = function(test) {
            try {
                var res = eval(test.code); //Makes code runnable
                $log.debug("Made " + test.id + " runnable...");
            } catch(ex) {
                $log.debug("Failed to make " + test.id + " runnable...");
            }
        }

        var LoadTest = function(test_id) {
            Test.get({
                id: test_id
            }).$promise.then(function(test) {
                SelectTest(test);
            })
        }

        var SaveTest = function() {
            GenerateCode().then(function() {
                var filteredActions = Tests.Selected.Test.actions.filter(function(action) {
                    return action.id != null && action.id != "";
                });

                //Save to api
                APIService.SaveTest(Tests.Selected.Test.id, {
                    id: Tests.Selected.Test.id,
                    code: Tests.Selected.Test.code,
                    actions: filteredActions
                });

                Tests.AvailableTests.remove(function(test) {
                    return test.id == Tests.Selected.Test.id;
                });

                Tests.AvailableTests.push({
                    id: Tests.Selected.Test.id,
                    code: Tests.Selected.Test.code,
                    actions: filteredActions
                });
            });
        }

        var SelectTest = function(test) {
            if (test != null) {
                $log.debug("SelectTest - Selected {test_id}".assign({
                    test_id: test.id
                }));
                Tests.Selected.Test = test;
            } else {
                $log.debug("SelectTest - Selected {test_id}".assign({
                    test_id: null
                }));
                Tests.Selected.Test = null;
            }
            UpdateTestAvailableActions();
            UpdateTestAvailableParameters();
        }

        var RunTest = function(test) {
            var res = eval(test.code); //Makes code runnable
            var service = $injector.get(test.id);
            service.FSM.go({});
        }

        var GetTemplate = function(filepath, data) {
            var deferred = $q.defer();
            $http.get(filepath + '.smt').success(function(src) {
                deferred.resolve(Handlebars.compile(src)(data));
            });
            return deferred.promise;
        }

        var GenerateFSM = function() {
            var template = 
                'this.FSM = new BaseFSM("{1}FSM","Start");' +
                'this.FSM.go = function(obj) {' +
                'return this.start(obj);' +
                '\};';
            var res = template.assign(Tests.Selected.Test.id);

            Tests.Selected.Test.actions.forEach(function(action) {
                if (action.id == null || action.id.isBlank()) {
                    return;
                }
                res += 'this.FSM.addState("{1}", {1});'.assign(action.id);
            });

            res += 'return this;';

            return res;
        }

        var GenerateCode = function() {
            Tests.Selected.Test.code = "";

            var acts = Tests.Selected.Test.actions.filter(function(item) {
                if (item.id == null || item.id.isBlank()) {
                    return false;
                } else {
                    return true;
                }
            });

            var codesPromises = acts.map(function(action) {
                var deferred = $q.defer();
                //Template can't take nested objects
                var aO = angular.copy(action);
                if (aO.params != null) {
                    if (aO.params.nextAction != null)
                        aO.params.nextAction = action.params.nextAction.id;
                    if (aO.params.repeatAction != null)
                        aO.params.repeatAction = action.params.repeatAction.id;
                    if (aO.params.cancelAction != null)
                        aO.params.cancelAction = action.params.cancelAction.id;
                    if (aO.params.errorAction != null)
                        aO.params.errorAction = action.params.errorAction.id;
                    if (aO.params.deviceType != null)
                        aO.params.deviceType = action.params.deviceType.toLowerCase();
                }
                if (action.type == 'ObjectManipulation') {
                    return GetTemplate('SMS/transforms/ObjectManipulation/' + action.params.objManipType, action);
                } else {
                    return GetTemplate('SMS/transforms/' + action.type, action);
                }
                console.error("NOT TEMPLATE FOUND FOR: " + action.type);
                return deferred.promise;
            });

            return $q.all(codesPromises).then(function(codes) {
                Tests.Selected.Test.code += "angular.module('netLabApp').register.service('" + Tests.Selected.Test.id + "', function("
                Tests.Selected.Test.code += "$api,StorageService,BaseFSM,$http,$q,ModalService,Device,$rootScope,$controller"; //Dependancies
                Tests.Selected.Test.code += ") {"; 

                for (var code in codes) {
                    Tests.Selected.Test.code += codes[code];
                }

                Tests.Selected.Test.code += GenerateFSM();
                Tests.Selected.Test.code += "});"

                Tests.Selected.Test.code = js_beautify(Tests.Selected.Test.code);
            });
        }

        var AddAction = function(action) {
            //Clone action
            var newAction = angular.copy(action)
            newAction.id = "";
            newAction.x = 0;
            newAction.y = 0;
            newAction.params = {};

            if (Tests.Selected.Test == null) {
                Tests.Selected.Test = {
                    id: "NewTest",
                    code: "",
                    actions: []
                };
            }

            if (Tests.Selected.Test.actions == null) {
                Tests.Selected.Test.actions = [];
            }

            Tests.Selected.Test.actions.push(newAction);
            UpdateTestAvailableActions();
        }

        var RemoveAction = function(action) {
            Tests.Selected.Test.actions.remove(action);
            UpdateTestAvailableActions();
        }

        var SelectAction = function(action) {
            Tests.Selected.Action = action;
        }

        var UpdateTestAvailableActions = function() {
            if (Tests.Selected.Test == null || Tests.Selected.Test.actions == null) {
                Tests.AvailableActions = [];
            } else {
                Tests.AvailableActions = Tests.Selected.Test.actions.map(function(action) {
                    if (action != null && action.id != null) {
                        return action;
                    }
                }).flatten();
            }
        }

        var GetTestAvailableParameters = function(test) {

            if (test == null || test.actions == null) {
                return [];
            }

            var result = [];
            var startAction = test.actions.find(function(action) {
                return action.type == 'Start';
            });

            if (startAction != null && startAction.params != null && startAction.params.initial != null) {
                result = result.include(startAction.params.initial);
            }

            return angular.copy(result.flatten());
        }

        var UpdateTestAvailableParameters = function() {
            var result = [];

            if (Tests.Selected.Test == null || Tests.Selected.Test.actions == null) {
                Tests.AvailableParameters = [];
            } else {

                Tests.AvailableParameters = GetTestAvailableParameters(Tests.Selected.Test).map('name').flatten();
            }
        }

        var addInitialParameter = function() {
            if (Tests.Selected.Action.newParam != null && !Tests.Selected.Action.newParam.name.isBlank()) {
                if (Tests.Selected.Action.params.initial == null) {
                    Tests.Selected.Action.params.initial = [];
                }
                if (Tests.Selected.Action.newParam.value == null || Tests.Selected.Action.newParam.value.isBlank()) {
                    Tests.Selected.Action.newParam.value = {};
                }
                if (Tests.Selected.Action.newParam.name.toLowerCase() == "true") {
                    Tests.Selected.Action.newParam.value = true;
                }
                if (Tests.Selected.Action.newParam.name.toLowerCase() == "false") {
                    Tests.Selected.Action.newParam.value = false;
                }
                Tests.Selected.Action.params.initial.push(Tests.Selected.Action.newParam);
            }

            //Reset Fields
            Tests.Selected.Action.newParam = {
                name: "",
                value: ""
            };
            UpdateTestAvailableParameters();
        }

        var removeInitialParameter = function(param) {
            Tests.Selected.Action.params.initial.remove(param);
        }

        var GetSMInitialParameters = function() {

            if (Tests.Selected.Action.params != null && Tests.Selected.Action.params.machine != null) {
                var test = Tests.AvailableTests.find(function(test) {
                    return test.id == Tests.Selected.Action.params.machine;
                });

                Tests.Selected.Action.params.SMParams = GetTestAvailableParameters(test);

                if (test != null) {
                    var endAction = test.actions.find(function(action) {
                        return action.type == "End" && action.id != "";
                    });
                    if (endAction != null && endAction.params != null) {
                        Tests.Selected.Action.ReturnsBool = endAction.params.returnBool == true ? true : false;
                    }
                }
            }
        }

        var addKey = function(action, obj) {
            if (obj != null && !obj.key.isBlank()) {
                if (action.params.keys == null) {
                    action.params.keys = [];
                }
                action.params.keys.push({
                    key: obj.key,
                    isParam: obj.isParam
                });
            }
        }

        var removeKey = function(action, param) {
            action.params.keys.remove(param);
        }

        var addStoreKey = function(action, obj) {
            if (obj != null && !obj.key.isBlank()) {
                if (action.params.storeKeys == null) {
                    action.params.storeKeys = [];
                }
                action.params.storeKeys.push({
                    key: obj.key,
                    isParam: obj.isParam
                });
            }
        }

        var removeStoreKey = function(action, param) {
            action.params.storeKeys.remove(param);
        }

        var Tests = {
            AvailableTests: [],
            AvailableParameters: [],
            AvailableActions: [],
            Selected: {
                Action: null,
                Test: null
            },
            Functions: {
                //Tests
                LoadAllTests: LoadAllTests,
                LoadTest: LoadTest,
                SaveTest: SaveTest,
                SelectTest: SelectTest,
                RunTest: RunTest,
                GenerateCode: GenerateCode,
                GetSMInitialParameters: GetSMInitialParameters,

                //Actions
                AddAction: AddAction,
                RemoveAction: RemoveAction,
                SelectAction: SelectAction,
                addInitialParameter: addInitialParameter,
                removeInitialParameter: removeInitialParameter,
                addKey: addKey,
                removeKey: removeKey,
                addStoreKey: addStoreKey,
                removeStoreKey: removeStoreKey
            },
            Temp: {
                objKey: {
                    key: "",
                    value: "",
                    isParam: false
                },
                objStoreKey: {
                    key: "",
                    value: "",
                    isParam: false
                }
            }
        };

        return Tests;
    });
