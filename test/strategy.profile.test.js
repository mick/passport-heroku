/* global describe, it, expect, before */
/* jshint expr: true */

var HerokuStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  var strategy =  new HerokuStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});

  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (url != 'https://api.heroku.com/account') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

    var body = '{ "beta": false, "email": "ada@heroku.com", "id": "1c2630b3-55fd-4585-9e88-c7021a7bd607", "name": "Ada Lovelace", "verified": true }'

    callback(null, body, undefined);
  };

  describe('loading profile', function() {
    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('heroku');

      expect(profile.id).to.equal('1c2630b3-55fd-4585-9e88-c7021a7bd607');
      expect(profile.displayName).to.equal('Ada Lovelace');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('ada@heroku.com');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('encountering an error', function() {
    var err, profile;

    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });

    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });

});
