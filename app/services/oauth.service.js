// This service is really just an inter-service communication point for oauth related content
// TODO: Maybe there's a less round-about way to do this?

const { generateOAuthToken, isTokenValid } = require('../internal/services/client.service');

exports.generateOAuthToken = async function(key, secret) {
  return await generateOAuthToken(key, secret);
}

exports.isTokenValid = async function(token, key) {
  return await isTokenValid(token, key);
}
