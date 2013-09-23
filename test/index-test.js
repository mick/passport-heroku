var vows = require('vows');
var assert = require('assert');
var util = require('util');
var heroku = require('../lib/passport-heroku');


vows.describe('passport-heroku').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(heroku.version);
    },
  },
  
}).export(module);
