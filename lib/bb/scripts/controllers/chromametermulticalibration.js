'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ChromametermulticalibrationCtrl
 * @description
 * # ChromametermulticalibrationCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('ChromameterMultiCalibrationCtrl', function($scope, ModalService, $timeout, Device, $api, $modalInstance, $q) {
        $scope.header = "Multi Tile Calibration";
        $scope.state = 0;
        $scope.tile_index = 0;
        $scope.measure = {};
        $scope.white_tile = {};

        $scope.tile_status = [
            'current-tile',
            'waiting',
            'waiting',
            'waiting',
            'waiting',
        ];

        $scope.tileHueAngles = [
            0,
            118.78,
            112.2,
            90.18,
            100.89
        ];
        $scope.calibrate_promise = null;

        $scope.current_action = 0;
        $scope.actions = [{
                instruction: "Please place chromameter on the white tile then press ok",
                ok: function() {
                    $scope.nextAction(true);
                }
            }, {
                instruction: "Checking the device is on the white tile...",
                action: function(param) {
                    $scope.checkIsWhiteTile().then(function(res) {
                        console.log("DeltaE: " + res);
                        if (res < 4) {
                            $scope.nextAction(true);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Calibrating Device...",
                action: function(param) {
                    $scope.calibrate_promise = Device.Calibrate("chromameter", 0);
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 4000);
                }
            }, {
                instruction: "Reading Calibration values...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 10000);
                }
            }, {
                instruction: "Setting Device Defaults...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 2000);
                }
            }, {
                instruction: "Reading Calibrated Value...",
                action: function(param) {
                    $scope.calibrate_promise.then(function(value) {
                        $scope.measure = value.measure;
                        $timeout(function() {
                            $scope.nextAction(true);
                        }, 2000);
                    });

                }
            }, {
                instruction: "Checking Value is valid...",
                action: function(param) {
                    if ($scope.white_tile.success == true) {
                        var res = $scope.deltaE($scope.white_tile.message.C, $scope.white_tile.message.h, $scope.measure.C, $scope.measure.h);
                        console.log("DeltaE", res);
                        if (res < 4) {
                            $scope.tile_status[$scope.tile_index] = 'succeded-tile';
                            $scope.tile_status[$scope.tile_index + 1] = 'current-tile';
                            $scope.nextAction(false);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    } else { //Failed
                        $scope.tile_status[$scope.tile_index] = 'failed-tile';
                        $scope.current_action = $scope.actions.length - 1;
                    }
                }
            }, {
                instruction: "Please place chromameter on the tile 1 then press ok...",
                ok: function() {
                    $scope.tile_index = 1;
                    $scope.nextAction(true);
                }
            }, {
                instruction: "Checking tile 1...",
                action: function(param) {
                    $scope.tile_status[$scope.tile_index] = 'reading-tile';
                    $scope.checkIsTile(1.5).then(function(res) {
                        if (res == true) {
                            $scope.nextAction(true);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Calibrating Device...",
                action: function(param) {
                    $scope.calibrate_promise = Device.Calibrate("chromameter", 1);
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 4000);
                }
            }, {
                instruction: "Reading Calibration values...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 10000);
                }
            }, {
                instruction: "Setting Device Defaults...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 2000);
                }
            }, {
                instruction: "Reading Calibrated Value...",
                action: function(param) {
                    $scope.calibrate_promise.then(function(value) {
                        $scope.measure = value.measure;
                        $timeout(function() {
                            $scope.nextAction(true);
                        }, 2000);
                    });

                }
            }, {
                instruction: "Checking tile 1...",
                action: function(param) {
                    $scope.checkIsTile().then(function(res) {
                        if (res == true) {
                            $scope.tile_status[$scope.tile_index] = 'succeded-tile';
                            $scope.tile_status[$scope.tile_index + 1] = 'current-tile';
                            $scope.nextAction();
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Please place chromameter on the tile 2 then press ok...",
                ok: function() {
                    $scope.tile_index = 2;
                    $scope.nextAction(true);
                }
            }, {
                instruction: "Checking tile 2...",
                action: function(param) {
                    $scope.tile_status[$scope.tile_index] = 'reading-tile';
                    $scope.checkIsTile(1.5).then(function(res) {
                        if (res == true) {
                            $scope.nextAction(true);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Calibrating Device...",
                action: function(param) {
                    $scope.calibrate_promise = Device.Calibrate("chromameter", 2);
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 4000);
                }
            }, {
                instruction: "Reading Calibration values...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 10000);
                }
            }, {
                instruction: "Setting Device Defaults...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 2000);
                }
            }, {
                instruction: "Reading Calibrated Value...",
                action: function(param) {
                    $scope.calibrate_promise.then(function(value) {
                        $scope.measure = value.measure;
                        $timeout(function() {
                            $scope.nextAction(true);
                        }, 2000);
                    });

                }
            }, {
                instruction: "Checking tile 2...",
                action: function(param) {
                    $scope.checkIsTile().then(function(res) {
                        if (res == true) {
                            $scope.tile_status[$scope.tile_index] = 'succeded-tile';
                            $scope.tile_status[$scope.tile_index + 1] = 'current-tile';
                            $scope.nextAction();
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Please place chromameter on the tile 3 then press ok...",
                ok: function() {
                    $scope.tile_index = 3;
                    $scope.nextAction(true);
                }
            }, {
                instruction: "Checking tile 3...",
                action: function(param) {
                    $scope.tile_status[$scope.tile_index] = 'reading-tile';
                    $scope.checkIsTile(1.5).then(function(res) {
                        if (res == true) {
                            $scope.nextAction(true);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Calibrating Device...",
                action: function(param) {
                    $scope.calibrate_promise = Device.Calibrate("chromameter", 3);
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 4000);
                }
            }, {
                instruction: "Reading Calibration values...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 10000);
                }
            }, {
                instruction: "Setting Device Defaults...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 2000);
                }
            }, {
                instruction: "Reading Calibrated Value...",
                action: function(param) {
                    $scope.calibrate_promise.then(function(value) {
                        $scope.measure = value.measure;
                        $timeout(function() {
                            $scope.nextAction(true);
                        }, 2000);
                    });

                }
            }, {
                instruction: "Checking tile 3...",
                action: function(param) {
                    $scope.checkIsTile().then(function(res) {
                        if (res == true) {
                            $scope.tile_status[$scope.tile_index] = 'succeded-tile';
                            $scope.tile_status[$scope.tile_index + 1] = 'current-tile';
                            $scope.nextAction();
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Please place chromameter on the tile 4 then press ok...",
                ok: function() {
                    $scope.tile_index = 4;
                    $scope.nextAction(true);
                }
            }, {
                instruction: "Checking tile 4...",
                action: function(param) {
                    $scope.tile_status[$scope.tile_index] = 'reading-tile';
                    $scope.checkIsTile(1.5).then(function(res) {
                        if (res == true) {
                            $scope.nextAction(true);
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Calibrating Device...",
                action: function(param) {
                    $scope.calibrate_promise = Device.Calibrate("chromameter", 4);
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 4000);
                }
            }, {
                instruction: "Reading Calibration values...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 10000);
                }
            }, {
                instruction: "Setting Device Defaults...",
                action: function(param) {
                    $timeout(function() {
                        $scope.nextAction(true);
                    }, 2000);
                }
            }, {
                instruction: "Reading Calibrated Value...",
                action: function(param) {
                    $scope.calibrate_promise.then(function(value) {
                        $scope.measure = value.measure;
                        $timeout(function() {
                            $scope.nextAction(true);
                        }, 2000);
                    });

                }
            }, {
                instruction: "Checking tile 4...",
                action: function(param) {
                    $scope.checkIsTile().then(function(res) {
                        if (res == true) {
                            $scope.tile_status[$scope.tile_index] = 'succeded-tile';
                            $scope.nextAction();
                        } else {
                            $scope.tile_status[$scope.tile_index] = 'failed-tile';
                            $scope.current_action = $scope.actions.length - 1;
                        }
                    });
                }
            }, {
                instruction: "Device Successfully calibrated",
                ok: function(param) {
                    $modalInstance.close(true);
                }
            }, {
                instruction: "Incorrect tile please contact an administrator",
                retry: function() {
                    $scope.tile_status[$scope.tile_index] = 'failed-tile';
                    $scope.retry();
                }
            }

        ];

        $scope.nextAction = function(auto_start) {
            $scope.current_action++;
            if (auto_start == true) {
                $scope.actions[$scope.current_action].action();
            }
        }

        $scope.checkIsWhiteTile = function() {
            var deferred = $q.defer();
            $scope.tile_status[$scope.tile_index] = 'reading-tile';
            Device.GetValue("Chromameter").then(function(dv) {
                API.Get('white_tile.json').then(function(av) {
                    $scope.white_tile = av;
                    deferred.resolve($scope.deltaE(av.message.C, av.message.h, dv.measure.C, dv.measure.h));
                });
            });

            return deferred.promise;
        }

        $scope.checkIsTile = function(dev) {
            var deferred = $q.defer();

            if (dev == null) {
                dev = 0.21;
            }
            $scope.tile_status[$scope.tile_index] = 'reading-tile';
            Device.GetValue("Chromameter").then(function(dv) {
                Device.GetValue("Chromameter").then(function(dv1) {
                    var dvAvg = (dv.measure.h + dv1.measure.h) / 2;
                    var deviation = Math.abs((dvAvg - $scope.tileHueAngles[$scope.tile_index]));
                    console.log("Deviation: " + deviation);
                    if (deviation < dev) {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                });
            });

            return deferred.promise;
        }




        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.retry = function() {
            switch ($scope.tile_index) {
                case 0:
                    $scope.current_action = 0;
                    break;
                case 1:
                    $scope.current_action = 7;
                    break;
                case 2:
                    $scope.current_action = 14;
                    break;
                case 3:
                    $scope.current_action = 21;
                    break;
                case 4:
                    $scope.current_action = 28;
                    break;
            }
        }

        $scope.deltaE = function(aC, aH, rC, rH) {
            var mA = rC * Math.cos(rH * Math.PI / 180);
            var mB = rC * Math.sin(rH * Math.PI / 180);
            var rA = aC * Math.cos(aH * Math.PI / 180);
            var rB = aC * Math.sin(aH * Math.PI / 180);
            var A = Math.pow(rA - mA, 2);
            var B = Math.pow(rB - mB, 2);
            return Math.sqrt(A + B);
        }
    });
