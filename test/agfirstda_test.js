/*global describe,it*/
'use strict';
var assert = require('assert'),
  agfirstda = require('../lib/agfirstda.js');

describe('agfirstda node module.', function() {
  it('must be awesome', function() {
    assert( agfirstda.awesome(), 'awesome');
  });
});
