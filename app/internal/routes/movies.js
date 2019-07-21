const { wrapAsync } = require('../../services/router.service');

module.exports = (router) => {
  router.get('/', wrapAsync(async (_, res) => {
    res.send('movies');
  }));
};
