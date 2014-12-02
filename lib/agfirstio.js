/*
 *
 * https://github.com/Anthbs/agfirstda
 *
 * Copyright (c) 2014 Anthony Barr-Smith
 * Licensed under the MIT license.
 */
'use strict';

var io = require('socket.io')();

var agfdevices = null;
var listeners = {

};

exports.setup = function(devices) {
    agfdevices = devices;
    io.on('connection', this.socket_connected);
    io.listen(9001);
}.bind(this);

exports.socket_connected = function(socket) {
    socket.on('Get_Value', function(data, callback) {
        this.get_value(socket, data, callback);
    }.bind(this));

    socket.on('Get_Value_Open', function(data, callback) {
        this.get_value_open(socket, data, callback);
    }.bind(this));

    socket.on('Get_Value_Close', function(data, callback) {
        this.get_value_close(socket, data, callback);
    }.bind(this));

    socket.on('Change_Config', function(data, callback) {
        agfdevices.change_config(data.com_port, data.type, data.model);
        callback({ success: true, message: data.com_port + " successfully configured"});
    }.bind(this));

    socket.on('Get_Ports', function(data, callback) {
        agfdevices.get_ports(callback, true);
    }.bind(this));

    socket.on('Get_Device_Types', function(data, callback) {
        agfdevices.get_types(callback);
    }.bind(this));
}.bind(this);

exports.get_value = function(socket, data, callback) {
    var port = agfdevices.port_settings[data.com_port];
    if (port != null && port.device != null) {
        port.device.get_value();
    }
}.bind(this);

exports.get_value_open = function(socket, data, callback) {
    if(listeners[data.com_port] == null) {
    	listeners[data.com_port] = [];
    }
    listeners[data.com_port].push({ event_name: data.event_name, com_name: data.com_port });
    console.log("Added Listener on " + data.com_port + " - " + data.event_name);
}.bind(this);

exports.get_value_close = function(socket, data, callback) {
    if(listeners[data.com_port] != null) {
    	for(var key in listeners[data.com_port]) {
    		if(listeners[data.com_port][key].event_name == data.event_name) {
    			listeners[data.com_port].remove(listeners[data.com_port][key]);
    		}
    	}
    }
}.bind(this);

exports.send_message = function(port, data) {
    io.emit(port, { success: true,  measure: data });
    if(listeners[port] != null && listeners[port].length > 0) {
    	for(var key in listeners[port]) {
    		io.emit(listeners[port][key].event_name, { success: true,  measure: data });
    	}
    }
}.bind(this);
