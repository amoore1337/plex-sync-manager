const { wrapAsync } = require('../../services/router.service');
const path = require('path');
const { compressDir, packagingPath, removePackagedFile } = require('../services/file.service');

module.exports = (router) => {
  router.get('/', wrapAsync(async (req, res) => {
    const filePath = decodeURIComponent(req.query.file);
    compressDir(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => console.error(err));
  }));
};
