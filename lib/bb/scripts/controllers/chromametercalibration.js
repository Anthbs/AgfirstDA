'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ChromametercalibrationCtrl
 * @description
 * # ChromametercalibrationCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('ChromameterCalibrationCtrl', function($scope, ModalService, $timeout, Device, $api, $modalInstance, $q) {
        $scope.header = "White Tile Calibration";
        $scope.instruction = 0;
        $scope.instructions = [
            "Please place chromameter on the white tile then press ok",
            "Checking the device is on the white tile...",
            "Calibrating Device...",
            "Reading Calibration values...",
            "Setting Device Defaults...",
            "Reading Calibrated Value...",
            "Checking Value is valid...",
            "Device Successfully calibrated",
            "Device Failed Calibration...",
            "Incorrect tile please contact an administrator"
        ];
        $scope.measure = {};

        $scope.ok = function() {
            if ($scope.instruction == 0) {
                $scope.instruction++;
                $scope.checktile().then(function(correct_tile) {
                    if (correct_tile == true) {
                        $scope.calibrate();
                    } else {
                        $scope.instruction = 9;
                    }
                });
            } else if ($scope.instruction == 7) {
                $modalInstance.close(true);
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

        $scope.checktile = function() {
            var deferred = $q.defer();

            Device.GetValue("Chromameter").then(function(dv) {
                API.Get('white_tile.json').then(function(av) {
                    deferred.resolve($scope.deltaE(av.message.C, av.message.h, dv.measure.C, dv.measure.h) < 4);
                });
            });

            return deferred.promise;
        }

        $scope.calibrate = function() {
            var get_value_promise = null;
            $scope.instruction++;
            $timeout(function() {
                get_value_promise = Device.Calibrate("chromameter", 0);
                $scope.instruction++;
            }, 4000).then(function() {
                return $timeout(function() {
                    $scope.instruction++;
                }, 10500);
            }).then(function() {
                return $timeout(function() {}, 2000);
            }).then(function() {
                return API.Get('white_tile.json');
            }).then(function(result) {
                var deferred = $q.defer();
                $timeout(function() {
                    $scope.instruction++;
                    $timeout(function() {
                        deferred.resolve(result);
                    }, 2000);
                }, 2000);

                return deferred.promise;
            }).then(function(result) {
                get_value_promise.then(function(value) {
                    $scope.measure = value.measure;
                    $scope.instruction++;
                    $timeout(function() {
                        if (result.success == true) {
                            var deltaE = $scope.deltaE(result.message.C, result.message.h, $scope.measure.C, $scope.measure.h);
                            console.log("DeltaE", deltaE);
                            if (deltaE < 4) {
                                $scope.instruction++;
                            } else {
                                $scope.instruction = $scope.instruction + 2;
                            }
                        } else { //Failed
                            $scope.instruction = $scope.instruction + 2;
                        }
                    }, 2000);
                });
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.retry = function() {
            $scope.instruction = 0;
        }
    });
