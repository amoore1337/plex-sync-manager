const { wrapAsync, isAuthenticated } = require('../../services/router.service');
const {
  compressMovie,
  compressTvShow,
  packagingPath,
  removePackagedFile,
  getPathFromHash,
} = require('../services/file.service');

// This probably isn't necessary, but to keep from broadcasting what content is being obtained,
// we'll obfuscate the endpoints a little: m => movies, s => tv shows
module.exports = (router) => {
  router.post('/m', isAuthenticated, wrapAsync(async (req, res) => {
    const filePath = getPathFromHash(req.body.token);
    if (!filePath) {
      return res.satus(404).send('Invalid identifier');
    }
    compressMovie(decodeURIComponent(filePath)).then(
      () => res.sendFile(packagingPath(filePath), {}, (err) => {
        if (!err) { removePackagedFile(filePath); }
      })
    ).catch(err => res.status(err.httpCode || 500).send(err.message));
  }));

  router.post('/s', isAuthenticated, wrapAsync(async (req, res) => {
    const filePath = getPathFromHash(req.body.token);
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
