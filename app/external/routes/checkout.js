const { wrapAsync } = require('../../services/router.service');
const {
  compressMovie,
  compressTvShow,
  packagingPath,
  removePackagedFile,
  getPathFromHash,
} = require('../services/file.service');

module.exports = (router) => {
  router.get('/movies/:id', wrapAsync(async (req, res) => {
    const filePath = getPathFromHash(req.params.id);
    if (!filePath) {
      return res.satus(404).send('Invalid identifier');
    }
    compressMovie(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => res.status(err.httpCode || 500).send(err.message));
  }));

  router.get('/shows', wrapAsync(async (req, res) => {
    const filePath = getPathFromHash(req.params.id);
    if (!filePath) {
      return res.satus(404).send('Invalid identifier');
    }
    compressTvShow(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => res.status(err.httpCode || 500).send(err.message));
  }));
};
