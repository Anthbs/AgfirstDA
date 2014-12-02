/*
 *
 * https://github.com/Anthbs/agfirstda
 *
 * Copyright (c) 2014 Anthony Barr-Smith
 * Licensed under the MIT license.
 */

'use strict';

var serialPort = require("serialport");
var storage = require('node-persist');
storage.initSync();



exports.port_settings = {
    'COM4': {
        type: 'Penetrometer',
        model: 'WEL',
        device: null
    }
};

exports.setup = function() {
	this.port_settings = storage.getItem('port_settings');
	if(this.port_settings == null) {
		this.port_settings = {};
	}
    this.get_ports(function(ports) {
        for (var key in ports) {
        	this.setup_port(ports[key], key);
        }
    }.bind(this));
}.bind(this);

exports.setup_port = function(port, com_name) {
    if (port != null && com_name != null) {
        //Connect port
        console.log("Trying " + com_name + " as " + port.type + " " + port.model);
        var device = require("./devices/" + port.type + "/" + port.model)();
        device.open_port(com_name, function() {});
        this.port_settings[com_name].device = device;
    } else {
        console.log(com_name + " is not configured!");
    }
}.bind(this);

exports.close_all_ports = function(callback) {
	this.get_ports(function(ports) {
        for (var key in ports) {
        	if(ports[key] != null && ports[key].device != null && ports[key].device.settings && ports[key].device.settings.port != null && ports[key].device.settings.port.instance != null) {
        		ports[key].device.settings.port.instance.close(function() {
        			console.log("Closed " + key);
        		});
        	}
        }
        setTimeout(function() { callback(); }, 1000);
    }.bind(this));
}

exports.change_config = function(com_name, type, model) {
    var ps = {
        type: type,
        model: model,
        device: null
    };
    this.close_all_ports(function() { 
	    this.port_settings[com_name] = ps;
	    var ts = {};
	    for(var key in this.port_settings) {
	    	var t = {
	    		type: this.port_settings[key].type,
	    		model: this.port_settings[key].model
	    	};
	    	ts[key] = t;
	    }
    	storage.setItem('port_settings', ts);
    	this.setup();
    }.bind(this));
}.bind(this);

exports.get_ports = function(callback, with_non_configured) {
    serialPort.list(function(err, ports) {
        var ports_with_settings = {};
        for (var key in ports) {
            ports_with_settings[ports[key].comName] = this.port_settings[ports[key].comName];
            if(with_non_configured == true && ports_with_settings[ports[key].comName] == null) {
                ports_with_settings[ports[key].comName] = null;
            }
        }
        callback(ports_with_settings);
    }.bind(this));
}.bind(this);

exports.get_port = function(com_port, callback) {
    this.get_ports(function(ports) {
        callback(ports[com_port]);
    });
}.bind(this);

exports.get_types = function(callback) {
    var types = [
        {
            type: "Chromameter",
            model: "300"
        },
        {
            type: "Penetrometer",
            model: "WEL"
        },
        {
            type: "Refractometer",
            model: "BRIX"
        },
        {
            type: "Scale",
            model: "AND_ANDG_ANDH"
        }
    ];

    callback(types);
}.bind(this);
