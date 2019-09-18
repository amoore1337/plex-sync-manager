const { wrapAsync } = require('../../services/router.service');
const path = require('path');
const { compressDir, decompressDir, packagingPath, removePackagedFile } = require('../services/file.service');

module.exports = (router) => {
  router.get('/', wrapAsync(async (req, res) => {
    const filePath = decodeURIComponent(req.query.file);
    compressDir(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    );
  }));

  router.get('/extract', wrapAsync(async (req, res) => {
    decompressDir(
      path.resolve('./app/external/test-files/test.tar'),
      path.resolve('./app/external/extract-output')
    ).then(res.send('ok'))
  }));
};
