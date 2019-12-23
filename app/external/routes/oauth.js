const { wrapAsync } = require('../../services/router.service');
const { generateOAuthToken } = require('../../services/oauth.service');

module.exports = (router) => {
  router.post('/', wrapAsync(async (req, res) => {
    if (req.body.grant_type !== 'client_credentials') {
      res.json({ error: 'Grant Type of client_credentials required.' }).status(403);
      return;
    }

    const key = req.body.client_id;
    const secret = req.body.client_secret;
    if (!key || !secret) {
      res.json({ error: 'Client Id and Secret required.' }).status(403);
      return;
    }

    const token = await generateOAuthToken(key, secret);
    if (!token) {
      res.json({ error: 'Credentials invalid.' }).status(403);
      return;
    }

    res.json({ access_token: token, token_type: 'bearer' });
  }));
};
