'use strict';

/**
 * @ngdoc service
 * @name netLabApp.SocketIO
 * @description
 * # SocketIO
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('SocketIO', function($rootScope, $q) {
        this.url = 'http://localhost:9001';
        this.states = {
            disconnected: 'disconnected',
            connected: 'connected',
            connecting: 'connecting'
        }
        this.state = this.states.disconnected;

        this.connectEvent = function() {
            $rootScope.$apply(function() {
                this.state = this.states.connected;
                console.log("Connected to " + this.url);
            }.bind(this));
        }.bind(this);

        this.disconnectEvent = function(reason) {
            $rootScope.$apply(function() {
                this.state = this.states.disconnected;
                console.log("Connection lost (" + reason + ")");
            }.bind(this));
        }.bind(this);

        this.Connect = function() {
            if (this.state == this.states.disconnected) {
                this.state = this.states.connecting;
                this.socket = io.connect(this.url, {
                    'reconnection delay': 2000
                });

                this.socket.on('message', function(data) {
                    //console.log("Data Recieved:",data);
                });

                this.socket.on('connect', this.connectEvent);
                this.socket.on('disconnect', this.disconnectEvent);
            }

        }.bind(this);

        this.GetValue = function(com_port)
	    {
	        var deferred = $q.defer();
	        if(com_port != null) {
		        var params = { 
		            com_port: com_port
		        };

		        this.socket.emit('Get_Value', params);
		    } else {
		    	deferred.resolve({ success: false, message: 'Invalid COM port'});
		    }

	        return deferred.promise;

	    }.bind(this);

        this.GetValueOpen = function(com_port, eventCallback)
        {
            if (eventCallback != null && typeof eventCallback == 'function') {

                var date = new Date();

                if(com_port != null) {
                    var eventCall = md5(com_port + date.getTime());
                    var params = { 
                        event_name: eventCall,
                        com_port: com_port
                    };
                    console.log("Params: ", params);
                    this.socket.on(eventCall, function(data) { $rootScope.$apply(function() { eventCallback(data) }); });
                    this.socket.emit('Get_Value_Open', params);
                    return { success: true, message: eventCall };

                } else {
                    return { success: false, message: 'Invalid COM port' };
                }

            } else {
                return { success: false, message: 'Invalid callback method provided' };
            }
        }.bind(this);

        this.GetValueClose = function(device, event_name)
        {
            if(device != null && device.id != null && device.com_port != null) {
                var params = { 
                    device: device.id,
                    event_name: '',
                    com_port: device.com_port
                };

                this.socket.emit('Get_Value_Close', params);
                return { success: true, message: event_name };
            } else {
                return { success: false, message: 'Device not connected' };
            }
        }.bind(this);


        this.GetPorts = function() {
            var deferred = $q.defer();

            this.socket.emit('Get_Ports', {}, function(data) {
                $rootScope.$apply(function() {
                    console.log("Get_Ports Response:", data);
                    deferred.resolve(data);
                    $rootScope.$broadcast('socket:Get_Ports', data);
                });
            });

            return deferred.promise;
        }.bind(this);

        this.GetDeviceTypes = function() {
            var deferred = $q.defer();

            this.socket.emit('Get_Device_Types', {}, function(data) {
                $rootScope.$apply(function() {
                    console.log("Get_Device_Types Response:", data);
                    deferred.resolve(data);
                    $rootScope.$broadcast('socket:Get_Device_Types', data);
                });
            });

            return deferred.promise;
        }.bind(this);

        this.GetDevices = function()
		{
			var deferred = $q.defer();

            this.GetPorts().then(function(ports) {
                this.GetDeviceTypes().then(function(DeviceTypes) {
                    var devices = {};
                    for(var key in ports) {
                        if(ports[key] != null) {
                            var device = DeviceTypes.find(function(type) {
                                return type.type == ports[key].type && type.model == ports[key].model;
                            });
                            if(device != null) {
                                device.com_port = key;
                            }
                            devices[key] = device;
                        }
                    }
                    this.devices = devices;
                    console.log("GetDevices Response",devices);
                    deferred.resolve(devices);
                }.bind(this));
            }.bind(this));

			return deferred.promise;
		}.bind(this);

        this.SaveDeviceSettings = function(port, type, model) {
            var deferred = $q.defer();

            var params = {
                com_port: port,
                type: type,
                model: model
            };

            this.socket.emit('Change_Config', params, function(data) {
                $rootScope.$apply(function() {
                    console.log("SaveDeviceSettings Response:", data);
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        }

        this.Calibrate = function(device, calibrate_id) {
            var deferred = $q.defer();

            var params = {
                device: device.id,
                port: device.com_port,
                cal_id: calibrate_id
            };

            this.socket.emit('CalibrateDevice', params, function(data) {
                $rootScope.$apply(function() {
                    console.log("CalibrateDevice Response:", data);
                    deferred.resolve(data);
                    $rootScope.$broadcast(device.id + 'ValueReceived', data);
                });
            });

            return deferred.promise;
        }.bind(this);

        this.Load = function(db, table, id) {
            var deferred = $q.defer();

            var params = {
                db: db,
                table: table,
                id: id,
                data: JSON.stringify(obj)
            };

            this.socket.emit('Load', {}, function(data) {
                $rootScope.$apply(function() {
                    console.log("GetPorts Response:", data);
                    deferred.resolve(data);
                    $rootScope.$broadcast('socket:GetPorts', data);
                });
            });

            return deferred.promise;
        }.bind(this);

        this.Save = function(db, table, id, obj) {
            var deferred = $q.defer();

            var params = {
                db: db,
                table: table,
                id: id,
                data: JSON.stringify(obj)
            };

            this.socket.emit('Save', {}, function(data) {
                $rootScope.$apply(function() {
                    console.log("GetPorts Response:", data);
                    deferred.resolve(data);
                    $rootScope.$broadcast('socket:GetPorts', data);
                });
            });

            return deferred.promise;
        }.bind(this);

        this.Connect();

        return this;
    });
