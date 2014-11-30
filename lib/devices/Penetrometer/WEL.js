var regexp = require('node-regexp');
var serialPort = require("serialport").SerialPort;
var agfirstio = require("../../agfirstio");

module.exports = function() {
    return new wel();
}

function wel() {
    this.settings = {
        device: {
            type: "Penetrometer",
            model: "WEL"
        },
        serial: {
            baudrate: 57600,
            databits: 8,
            stopbits: 1,
            parity: 'none'
        },
        regex: {
            pressed: regexp().start('1').must(',').something().toRegExp(),
            not_pressed: regexp().start('0').must(',').something().toRegExp(),
            m_value: regexp().start('m').must(',').something().toRegExp()
        },
        commands: {
            get_value: '',
            get_m: 'm\r\n'
        },
        port: {
            com_name: null,
            is_open: false,
            instance: null
        }
    };

    this.values = {
        m_value: 0,
        min_value: null,
        max_value: null,
        lines_read: 0
    };

    this.setup = function() {
        if (this.settings.port.instance != null && this.settings.port.is_open == true) {
            this.settings.port.instance.write(this.settings.commands.get_m, function() {});
            this.settings.port.instance.flush(function() {});
        }
    }.bind(this);

    this.open_port = function(port, callback) {
        if (this.settings.port.is_open == false && this.settings.port.instance == null) {
            this.settings.port.instance = new serialPort(port, this.settings.serial, false);
        } else if (this.settings.port.is_open == true && this.settings.port.instance != null) {
            this.settings.port.instance.close(function() {
                this.settings.port.com_name = port;
                this.settings.port.instance.open(function(error) {
                    this.port_opened(error, port);
                }.bind(this));
                callback(this.settings.port.instance);
            }.bind(this));
            return;
        }
        this.settings.port.com_name = port;
        this.settings.port.instance.open(function(error) {
            this.port_opened(error, port);
        }.bind(this));
        callback(this.settings.port.instance);
    }.bind(this);

    this.port_opened = function(error, port) {
        if (error == null) {
            this.settings.port.is_open = true;
            console.log("Opened " + port + " for " + this.settings.device.model + " - " + this.settings.device.type);
            this.settings.port.instance.on('data', function(data) {
                this.received_data(data);
            }.bind(this));
            this.settings.port.instance.on('close', function(data) {
                this.closed(data);
            }.bind(this));
            this.setup();
        } else {
            console.log("Failed to open " + port + " for " + this.settings.device.model + " - " + this.settings.device.type + " - " + error);
        }
    }.bind(this);

    this.received_data = function(data) {
        var lines = data.toString().split("\r\n");
        for (var index in lines) {
            this.process_line(lines[index]);
        }
    }.bind(this);

    this.get_value = function() {
        if (this.settings.port.instance != null && this.settings.port.is_open == true) {
            this.settings.port.instance.write(this.settings.commands.get_value, function() {});
            this.settings.port.instance.flush(function() {});
        }
    }.bind(this);

    this.closed = function(data) {
        this.settings.port.is_open = false;
        this.settings.port.instance = null;
    }.bind(this);

    this.process_line = function(line) {
        if (this.settings.regex.m_value.test(line)) {
            var line_value = line.toString().split(',')[1];
            if (!isNaN(line_value)) {
                this.values.m_value = Number(line_value);
                console.log("M value: " + this.values.m_value);
            }
            return;
        }

        if (this.settings.regex.not_pressed.test(line)) { //Not pressed
            if (this.values.min_value != null) {
                if (this.values.lines_read > 10) {
                    this.send_result();
                }
                this.values.min_value = null;
                this.values.max_value = null;
            }
            this.values.lines_read = 0;
            return;
        }

        if (this.settings.regex.pressed.test(line)) { //Pressed

            var line_value = line.toString().split(',')[1];
            if (this.values.min_value == null) {
                this.values.min_value = line_value;
            }
            if (this.values.max_value == null || (!isNaN(line_value) && this.values.max_value < Number(line_value))) {
                this.values.max_value = Number(line_value);
            }
            this.values.lines_read++;
            return;
        }
    }.bind(this);

    this.get_result_object = function() {
        var res_obj = {
            min_value: this.values.min_value,
            max_value: this.values.max_value,
            m_value: this.values.m_value,
            value: ((this.values.max_value - this.values.min_value) * this.values.m_value),
            port: this.settings.port.com_name,
            device: this.settings.device
        };

        console.log("Penetrometer Result: " + JSON.stringify(res_obj));
        return res_obj;
    }.bind(this);

    this.send_result = function() {
        var res_obj = this.get_result_object();
        agfirstio.send_message(this.settings.port.com_name, res_obj);
    }.bind(this);

    return this;
}
