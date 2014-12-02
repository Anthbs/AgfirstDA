/*
 *
 * https://github.com/Anthbs/agfirstda
 *
 * Copyright (c) 2014 Anthony Barr-Smith
 * Licensed under the MIT license.
 */
'use strict';

exports.setup = function() {
	var async = require("async");
	var agfio = require("./agfirstio");
	var express = require('express');
	var app = express();
	app.use(express.static(__dirname + '/bb'));
	console.log(__dirname + '/bb');
	app.listen(process.env.PORT || 8081);

	var agfdevices = require("./agfirstdevices");
    var serialPort = require("serialport");

    async.parallel(
        [
            agfdevices.setup,
            function() {
                agfio.setup(agfdevices);
            }
        ]);

}