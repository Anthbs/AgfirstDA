'use strict';

/**
 * @ngdoc overview
 * @name netLabApp
 * @description
 * # netLabApp
 *
 * Main module of the application.
 */
var app = angular
    .module('netLabApp', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'angular.filter',
        'mgcrea.ngStrap'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$logProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider', function($stateProvider, $urlRouterProvider, $logProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

        $logProvider.debugEnabled(true);
        $logProvider.fsmEnabled = false;

        $urlRouterProvider.otherwise("/fullscreen/loading");

        $httpProvider.defaults.withCredentials = true;

        <!-- Dynamic loading of controllers -->
        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

        $.get('http://192.168.16.162:8888/test/', function(result) {
            for (var test in result) {
                try {
                    var res = eval(result[test].code); //Makes code runnable
                    console.debug("Made " + result[test].id + " runnable...");
                } catch (ex) {
                    console.debug("Failed to make " + result[test].id + " runnable...");
                }
            }

        });

        <!-- FullScreen -->
        $stateProvider
            .state({
                name: 'fullscreen',
                url: "/fullscreen",
                templateUrl: 'views/fullscreen.html',
                abstract: true
            })
            .state({
                parent: 'fullscreen',
                name: 'loading',
                url: "/loading",
                views: {
                    css: css_helper(['sections/loading']),
                    content: {
                        templateUrl: "views/loading.html",
                        controller: 'LoadingCtrl'
                    }
                }
            })
            .state({
                parent: 'fullscreen',
                name: 'login',
                url: "/login",
                views: {
                    css: css_helper(['sections/login', 'sections/station_info']),
                    station_info: {
                        templateUrl: "views/station_info.html",
                        controller: 'StationInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state({
                parent: 'fullscreen',
                name: 'workstation_configure',
                url: "/workstation/configure",
                views: {
                    content: {
                        templateUrl: "views/workstation/configure.html",
                        controller: 'WorkstationConfigureCtrl'
                    }
                }
            });

        <!-- Main Layout -->
        $stateProvider
            .state({
                name: 'main',
                url: "/main",
                templateUrl: 'views/main.html',
                abstract: true
            }).state({
                parent: 'main',
                name: 'dashboard',
                url: '/dashboard',
                views: {
                    header: {
                        templateUrl: "views/header.html"
                    },
                    content: {
                        templateUrl: "views/application/dashboard.html",
                        controller: 'ApplicationDashboardCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'main',
                name: 'scan_sample',
                url: "/scan_sample",
                views: {
                    css: css_helper(['sections/station_info']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    station_info: {
                        templateUrl: "views/station_info.html",
                        controller: 'StationInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/scan_sample.html",
                        controller: 'ScanSampleCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html',
                    }
                }
            })
            .state({
                parent: 'main',
                name: 'sample_login',
                url: "/sample_login",
                views: {
                    css: css_helper(['sections/station_info']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    station_info: {
                        templateUrl: "views/station_info.html",
                        controller: 'StationInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/sample_login.html",
                        controller: 'SampleLoginCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'main',
                name: 'byo_test',
                url: "/byo_test",
                views: {
                    css: css_helper(['sections/station_info', 'sections/byotest']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    content: {
                        templateUrl: "views/byotest/index.html",
                        controller: 'BYOTestCtrl'
                    }
                }
            }).state({
                parent: 'main',
                name: 'device_setup',
                url: "/device_setup",
                views: {
                    css: css_helper(['sections/station_info']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    station_info: {
                        templateUrl: "views/station_info.html",
                        controller: 'StationInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/device_setup.html",
                        controller: 'DeviceSetupCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            });

        <!-- Tests Layout -->
        $stateProvider
            .state({
                name: 'test',
                url: "/test",
                templateUrl: 'views/test.html',
                abstract: true
            })
            .state({
                parent: 'test',
                name: 'bulk_weight',
                url: "/bulk_weight/:sample_id",
                views: {

                    css: css_helper(['sections/content', 'sections/test_info', 'sections/bulk_weight']),

                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/bulk_weight.html",
                        controller: 'BulkWeightCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'fresh_weight',
                url: "/fresh_weight/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/fresh_weight']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/fresh_weight.html",
                        controller: 'FreshWeightCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'pressure',
                url: "/pressure/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/pressure']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/pressure.html",
                        controller: 'PressureCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'colour',
                url: "/colour/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/colour']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/colour.html",
                        controller: 'ColourCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'dryin',
                url: "/dryin/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/dryin']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/dryin.html",
                        controller: 'DryInCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'dryout',
                url: "/dryout/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/dryout']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/dryout.html",
                        controller: 'DryOutCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            }).state({
                parent: 'test',
                name: 'brix',
                url: "/brix/:sample_id",
                views: {
                    css: css_helper(['sections/test_info', 'sections/brix']),
                    header: {
                        templateUrl: "views/header.html"
                    },
                    test_info: {
                        templateUrl: "views/elements/test_info.html",
                        controller: 'TestInfoCtrl'
                    },
                    content: {
                        templateUrl: "views/brix.html",
                        controller: 'BrixCtrl'
                    },
                    sidebar: {
                        templateUrl: 'views/application/sidebar.html'
                    }
                }
            });


    }]).run(function($rootScope, $location, $http, $templateCache, SocketIO, APIService, $api, StorageService, BaseFSM, $q, ModalService, Device, $controller, $log) {
        var templatesToCache = [
            'SMS/svgs/API.svg',
            'SMS/svgs/Broadcast.svg',
            'SMS/svgs/Code.svg',
            'SMS/svgs/DisplayValue.svg',
            'SMS/svgs/End.svg',
            'SMS/svgs/GetDeviceValue.svg',
            'SMS/svgs/Line.svg',
            'SMS/svgs/Listener.svg',
            'SMS/svgs/Math.svg',
            'SMS/svgs/ObjectManipulation.svg',
            'SMS/svgs/Repeat.svg',
            'SMS/svgs/Start.svg',
            'SMS/svgs/StateMachine.svg',
            'SMS/svgs/UserInput.svg',
            'SMS/svgs/Validate.svg'
        ];

        templatesToCache.forEach(function(template) {
            $http.get(template, {
                cache: $templateCache
            });
        });

        window.fsmEnabled = true;

        //Add state machine log call
        $log.fsm = function() {
            if (window.fsmEnabled == true) {
                $log.info.apply(this, arguments);
            }
        }

        //Setup for dynamic tests!
        $rootScope.clone = function(obj, dst) {

            var dstObj = (dst == null || typeof dst == 'undefined') ? {} : dst;

            if ($rootScope.isArray(obj)) { /* obj we've been passed is an array */
                if (obj.length > 0) {
                    for (var key in obj) {
                        if ($rootScope.isObject(obj[key]) || $rootScope.isArray(obj[key])) {
                            dstObj[key] = $rootScope.clone(obj[key], dstObj[key]);
                        } else {
                            dstObj[key] = obj[key];
                        }
                    }
                } else {
                    dstObj = obj;
                }
            } else if ($rootScope.isObject(obj)) { /* obj we've been passed is an object */
                for (var key in obj) {
                    if ($rootScope.isObject(obj[key]) || $rootScope.isArray(obj[key])) {
                        dstObj[key] = $rootScope.clone(obj[key], dstObj[key]);
                    } else {
                        dstObj[key] = obj[key];
                    }
                }
            } else {
                dstObj = obj;
            }

            return dstObj;

        }

        $rootScope.isObject = function(obj) {
            return (obj != null && typeof obj == 'object' && obj.length == null);
        }

        $rootScope.isArray = function(obj) {
            return (obj != null && typeof obj == 'object' && obj.length != null);
        }

        window.ToArray = function toArray(object) {
            return angular.isArray(object) ? object :
                Object.keys(object).map(function(key) {
                    return object[key];
                });
        }

        window.ToObject = function(obj) {
            var res = {};
            for (var key in obj) {
                res[key] = obj[key];
            }
            return res;
        }
        window.API = $api;
        window.StorageService = StorageService;
        window.BaseFSM = BaseFSM;
        window.$http = $http;
        window.$q = $q;
        window.ModalService = ModalService;
        window.DeviceService = Device;
        window.$rootScope = $rootScope;
        window.$controller = $controller;
        window.LoadTestCode = function(testID) {
                var deferred = $q.defer();
                //Load from api
                APIService.LoadTest(testID).then(function(test) {
                    if (test != null) {
                        deferred.resolve(test.code);
                    } else {
                        console.log("Couldn't load Required Test!");
                    }
                });
                return deferred.promise;
            }
            //End setup for dynamic tests

        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            var path = $location.path();
            $rootScope.isSplash = (path == "/" || path == "/loading" || path == "/login");
        });
    });

var css_helper = function(css_array) {
    return {
        controller: ['$scope', function($scope) {
            $scope.css_array = css_array.map(function(css) {
                return "/styles/" + css + ".css";
            });
        }],
        template: '<link rel="stylesheet" ng-repeat="css in css_array" ng-href="{{css}}">'
    };
}
