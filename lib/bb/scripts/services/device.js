'use strict';

/**
 * @ngdoc service
 * @name netLabApp.Device
 * @description
 * # Device
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('Device', function(SocketIO, $q) {
            this.Service = SocketIO;
            this.Devices = [];

            var GetDevices = function() {
                return this.Service.GetDevices().then(function(devices) {
                    this.Devices = devices;
                    return devices;
                }.bind(this));
            }.bind(this);

            var GetValue = function(device_type) {
                return GetDevices().then(function(devices) {
                        var device = null;
                        for(var key in devices) {
                            if(devices[key].type.toLowerCase() == device_type.toLowerCase()) {
                                device = devices[key].com_port;
                            }
                        }

                        return this.Service.GetValue(device);
                    }.bind(this));
                }.bind(this);

            var GetValueOpen = function(device_type, eventCallback) {
                return GetDevices().then(function(devices) {
                        var device = null;
                        for(var key in devices) {
                            if(devices[key].type.toLowerCase() == device_type.toLowerCase()) {
                                device = devices[key].com_port;
                            }
                        }

                        return this.Service.GetValueOpen(device, eventCallback);
                    }.bind(this));
                }.bind(this);

                var Calibrate = function(device_type, calibrate_id) {
                    return GetDevices().then(function(devices) {
                        var device = devices.find(function(d) {
                            return d.type.toLowerCase() == device_type.toLowerCase();
                        }.bind(this));

                        return this.Service.Calibrate(device, calibrate_id);
                    }.bind(this));

                }.bind(this);

                var Scale = {
                    connected: false,
                    GetValue: GetValue.fill('Scale'),
                }

                var Penetrometer = {
                    connected: false,
                    GetValue: GetValue.fill('Penetrometer'),

                }

                var Chromameter = {
                    connected: false,
                    GetValue: GetValue.fill('Chromameter'),
                }


                return {
                    Scale: Scale,
                    Penetrometer: Penetrometer,
                    Chromameter: Chromameter,
                    GetDevices: GetDevices,
                    GetValue: GetValue,
                    GetValueOpen: GetValueOpen,
                    Calibrate: Calibrate
                }
            });
