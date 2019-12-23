const { wrapAsync } = require('../../services/router.service');
const { getClients, createClient } = require('../services/client.service');

module.exports = (router) => {
  router.get('/', wrapAsync(async (_, res) => {
    const clients = await getClients();
    res.json(clients);
  }));

  router.post('/', wrapAsync(async (req, res) => {
    const name = req.body.name;
    const client = await createClient(name);
    res.json(client);
  }));
};
