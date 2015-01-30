# Passport-Heroku

[Passport](http://passportjs.org/) strategy for authenticating with [Heroku](https://heroku.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Heroku in your Node.js applications.
By plugging into Passport, Heroku authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```no-highlight
$ npm install passport-heroku
```

## Usage

#### Configure Strategy

The Heroku authentication strategy authenticates users using a Heroku account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```js
passport.use(new HerokuStrategy({
    clientID: Heroku_CLIENT_ID,
    clientSecret: Heroku_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/heroku/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'heroku'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/heroku',
  passport.authenticate('heroku'));

app.get('/auth/heroku/callback', 
  passport.authenticate('heroku', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/mick/passport-heroku/tree/master/examples/login).

## Tests

```no-highlight
$ npm install --dev
$ make test
```

[![Build Status](https://secure.travis-ci.org/mick/passport-heroku.png)](http://travis-ci.org/mick/passport-heroku)

## Credits

  - [Mick Thompson](http://github.com/mick)
  - Based on [passport-github](http://github.com/jaredhanson/passport-github) by [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Mick Thompson <[http://mick.im/](http://mick.im/)>

