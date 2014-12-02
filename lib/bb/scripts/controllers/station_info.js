'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:StationInfoCtrl
 * @description
 * # StationInfoCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('StationInfoCtrl', function($scope, Device) {
        Device.GetDevices().then(function(devices) {
            $scope.Devices = devices;
        });
    });
