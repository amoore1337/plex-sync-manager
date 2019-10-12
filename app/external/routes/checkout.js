const { wrapAsync } = require('../../services/router.service');
const { compressMovie, compressTvShow, packagingPath, removePackagedFile } = require('../services/file.service');

module.exports = (router) => {
  router.get('/movies', wrapAsync(async (req, res) => {
    const filePath = decodeURIComponent(req.query.file);
    compressMovie(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => res.status(err.httpCode || 500).send(err.message));
  }));

  router.get('/shows', wrapAsync(async (req, res) => {
    const filePath = decodeURIComponent(req.query.file);
    compressTvShow(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => res.status(err.httpCode || 500).send(err.message));
  }));
};
