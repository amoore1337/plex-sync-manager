const { wrapAsync } = require('../../services/router.service');
const path = require('path');
const { compressDir } = require('../services/file.service');

module.exports = (router) => {
  router.get('/', wrapAsync(async (req, res) => {
    // req.query.file
    compressDir(
      path.resolve('./app/external/test-files/test-dir'),
      path.resolve('./app/external/test-files/test.tar')
    ).then(res.sendFile(path.resolve('./app/external/test-files/test.tar')));
  }));
};
