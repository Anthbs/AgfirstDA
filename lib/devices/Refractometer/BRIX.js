var regexp = require('node-regexp');
var serialPort = require("serialport").SerialPort;
var agfirstio = require("../../agfirstio");

module.exports = function() {
    return new brix();
}

function brix() {
    this.settings = {
        device: {
            type: "Refractometer",
            model: "BRIX"
        },
        serial: {
            baudrate: 57600,
            databits: 8,
            stopbits: 1,
            parity: 'none'
        },
        regex: {
            get_value: regexp().either(regexp.digit, regexp.letter).has(10).must(',').something().toRegExp()
        },
        commands: {
            get_value: 'm\r\n'
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
            console.log("Failed to open " + port + " for " + this.settings.device.model + " - " + this.settings.device.type);
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
        if (this.settings.regex.get_value.test(line)) { //Stable
            var line_value = line.toString().split(',')[1];
            if (!isNaN(line_value)) {
                this.values.value = Number(line_value);
                this.send_result();
            }
            return;
        }
    }.bind(this);

    this.get_result_object = function() {
        var res_obj = {
            value: this.values.value.toFixed(2),
            port: this.settings.port.com_name,
            device: this.settings.device
        };

        console.log("Brix Result: " + JSON.stringify(res_obj));
        return res_obj;
    }.bind(this);

    this.send_result = function() {
        var res_obj = this.get_result_object();
        agfirstio.send_message(this.settings.port.com_name, res_obj);
    }.bind(this);

    return this;
}
