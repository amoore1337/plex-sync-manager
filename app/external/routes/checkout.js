const { wrapAsync } = require('../../services/router.service');
const path = require('path');
const { execFile } = require('child_process')

module.exports = (router) => {
  router.get('/', wrapAsync(async (req, res) => {
    if (req.query.file === 'test-files') {
      execFile(
        path.resolve('./app/external/scripts/prep-files.sh'),
        [
          './app/external/test-files/delivery-1.zip',
          './app/external/test-files/test-dir/',
        ], {}, (err, out, stderr) => {
          console.log(err, out, stderr);
          res.sendFile(path.resolve(`./app/external/test-files/delivery-1.zip`));
        }
      )
    } else {
      res.sendFile(path.resolve(`./app/external/test-files/${req.query.file}`));
    }
  }));
};
