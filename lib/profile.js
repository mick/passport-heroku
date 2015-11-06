/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  // Normalized profile bits
  profile.id = String(json.id);
  profile.displayName = json.name;
  if (json.email) {
    profile.emails = [{value: json.email}]
  }
  // Heroku-specific profile bits
  profile.heroku = {
    beta: json.beta,
    verified: json.verified,
  }

  if (json.default_organization) {
    profile.heroku.default_organization = json.default_organization;
  }

  return profile;
};
