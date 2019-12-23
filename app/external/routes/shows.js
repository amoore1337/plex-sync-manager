const { wrapAsync, isAuthenticated } = require('../../services/router.service');
const { getExistingTvShowsMap } = require('../services/file.service');

module.exports = (router) => {
  router.get('/', isAuthenticated, wrapAsync(async (_, res) => {
    const contentMap = await getExistingTvShowsMap();
    res.json(contentMap);
  }));
};
