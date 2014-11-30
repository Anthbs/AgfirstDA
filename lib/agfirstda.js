/*
 *
 * https://github.com/Anthbs/agfirstda
 *
 * Copyright (c) 2014 Anthony Barr-Smith
 * Licensed under the MIT license.
 */
'use strict';

var async = require("async");
var agfdevices = require("./agfirstdevices");
var agfio = require("./agfirstio");
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/bb'));
console.log(__dirname + '/bb');
app.listen(process.env.PORT || 8081);

exports.setup = function() {
    async.parallel(
        [
            agfdevices.setup,
            function() {
                agfio.setup(agfdevices);
            }
        ]);
}


exports.has = function(array, value) {

    for (var key in array) {
        if (array[key] == value) {
            return true;
        }
    }

    return false;
}

exports.find = function(array, value) {

    for (var key in array) {
        if (array[key] == value) {
            return array[key];
        }
    }

    return null;
}
