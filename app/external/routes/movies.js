const { wrapAsync, isAuthenticated } = require('../../services/router.service');
const { getExistingMoviesMap } = require('../services/file.service');

module.exports = (router) => {
  router.get('/', isAuthenticated, wrapAsync(async (_, res) => {
    const contentMap = await getExistingMoviesMap();
    res.json(contentMap);
  }));
};
