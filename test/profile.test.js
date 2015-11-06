/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {

  describe('example profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('1c2630b3-55fd-4585-9e88-c7021a7bd607');
      expect(profile.displayName).to.equal('Ada Lovelace');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('ada@heroku.com');
      expect(profile.heroku.beta).to.equal(false);
      expect(profile.heroku.verified).to.equal(true);
      expect(profile.heroku.default_organization.name).to.equal('Acme');
    });
  });

  describe('example profile with null email', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example-null-email.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('1c2630b3-55fd-4585-9e88-c7021a7bd607');
      expect(profile.displayName).to.equal('Ada Lovelace');
      expect(profile.emails).to.be.undefined;
      expect(profile.heroku.beta).to.equal(false);
      expect(profile.heroku.verified).to.equal(true);
      expect(profile.heroku.default_organization).to.be.undefined;
    });
  });

});
