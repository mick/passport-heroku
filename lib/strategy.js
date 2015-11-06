/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Heroku authentication strategy authenticates requests by delegating to
 * Heroku using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Heroku application's Client ID
 *   - `clientSecret`  your Heroku application's Client Secret
 *   - `callbackURL`   URL to which Heroku will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'global', 'identity', 'read', 'write', 'read-protected', 'write-protected', or none.
 *                     (see https://devcenter.heroku.com/articles/oauth#scopes for more info)
 *
 * Examples:
 *
 *     passport.use(new HerokuStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/github/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://id.heroku.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://id.heroku.com/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-heroku';
  }
  if(!options.customHeaders['Accept']){
    options.customHeaders['Accept'] = "application/vnd.heroku+json; version=3";
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'heroku';
  this._userProfileURL = options.userProfileURL || 'https://api.heroku.com/account';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Heroku.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `heroku`
 *   - `id`               the user's Heroku ID
 *   - `displayName`      the user's full name
 *   - `emails`           the user's email addresses
 *   - `heroku`           an object containing heroku-specific fields
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'heroku';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
