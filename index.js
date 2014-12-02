'use strict';

var Readable = require("stream").Readable;
var util = require("util");
util.inherits(MyStream, Readable);
function MyStream(opt) {
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};
// hook in our stream
process.__defineGetter__("stdin", function() {
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

var agfirstda = require('./lib/agfirstda');
exports.setup = function() {
	agfirstda.setup();
}

setTimeout(this.setup, 1000);
