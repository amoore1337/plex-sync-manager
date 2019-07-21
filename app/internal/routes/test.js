const { wrapAsync } = require('../../services/router.service');
const exec = require('util').promisify(require('child_process').exec); // This should really be execFile

module.exports = (router) => {
  router.post('/send', wrapAsync(async (req, res) => {
    console.log("IP:", req.body.clientIp);
    const { stdout, stderr } = await exec('ls');
    console.log('stdout:', stdout);
    res.send({ msg: 'OK' });
  }));
};
