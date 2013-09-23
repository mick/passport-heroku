var vows = require('vows');
var assert = require('assert');
var util = require('util');
var HerokuStrategy = require('../lib/passport-heroku/strategy');


vows.describe('HerokuStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named heroku': function (strategy) {
      assert.equal(strategy.name, 'heroku');
    },
    'should have default user agent': function (strategy) {
      assert.equal(strategy._oauth2._customHeaders['User-Agent'], 'passport-heroku');
    },
  },
  
  'strategy with user agent option': {
    topic: function() {
      return new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userAgent: 'example.com'
      },
      function() {});
    },
    
    'should have correct user agent': function (strategy) {
      assert.equal(strategy._oauth2._customHeaders['User-Agent'], 'example.com');
    },
  },
  
  'strategy with user agent option in custom headers': {
    topic: function() {
      return new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        customHeaders: { 'User-Agent': 'example2.com' }
      },
      function() {});
    },
    
    'should have correct user agent': function (strategy) {
      assert.equal(strategy._oauth2._customHeaders['User-Agent'], 'example2.com');
    },
  },
  
  'strategy with user agent option in custom headers and explicit option': {
    topic: function() {
      return new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        customHeaders: { 'User-Agent': 'example2.com' },
        userAgent: 'example3.com'
      },
      function() {});
    },
    
    'should prefer custom headers': function (strategy) {
      assert.equal(strategy._oauth2._customHeaders['User-Agent'], 'example2.com');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        if (url == 'https://api.heroku.com/account') {
          var body = '{ "email":"hiROWcoo@heroku.com", "id": 1 }';
          callback(null, body, undefined);
        } else {
          callback(new Error('Incorrect user profile URL'));
        }
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'heroku');
        assert.equal(profile.id, '1');
        assert.equal(profile.email, 'hiROWcoo@heroku.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile from custom URL': {
    topic: function() {
      var strategy = new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://heroku.corpDomain/api/v3/user',
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        if (url == 'https://heroku.corpDomain/api/v3/user') {
         var body = '{ "email":"hiROWcoo@heroku.com", "id": 1 }';
          callback(null, body, undefined);
        } else {
          callback(new Error('Incorrect user profile URL'));
        }
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'heroku');
        assert.equal(profile.id, '1');
        assert.equal(profile.email, 'hiROWcoo@heroku.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new HerokuStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);
