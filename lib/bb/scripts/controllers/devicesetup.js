'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:DevicesetupCtrl
 * @description
 * # DevicesetupCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
  .controller('DeviceSetupCtrl', function ($scope, SocketIO) {
    $scope.Devices = {};
        $scope.COMPorts = [];
        $scope.DeviceTypes = [];


        SocketIO.GetDeviceTypes().then(function(types) {
            $scope.DeviceTypes = types;

            SocketIO.GetPorts().then(function(ports) {
                $scope.COMPorts = Object.keys(ports);
                $scope.COMPorts.forEach(function(port) {
                    $scope.Devices[port] = window.ToArray(types).find(function(type) {
                        if(ports[port] == null) {
                            return false;
                        }
                        return type.type == ports[port].type && type.model == ports[port].model;
                    });
                });
            });
        });

        $scope.SaveDeviceSettings = function(port, type, model, da_type) {
            SocketIO.SaveDeviceSettings(port, type, model, da_type);
        }
  });
