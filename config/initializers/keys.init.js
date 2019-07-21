const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const generate = Promise.promisify(require("pem").createCertificate);

const config = require('nconf');

module.exports = (callback) => {
  this.readKeys = () => {
    let keys = {};
    return fs.readFileAsync(config.get('NODE_KEY'), 'utf8').then(key => {
      keys.key = key;
      return fs.readFileAsync(config.get('NODE_CERT'), 'utf8')
    }).then(cert => {
      keys.cert = cert;
      return keys;
    }).catch(err => {
      return false;
    });
  }

  this.createKeys = () => {
    return createCertificate({ days: 1, selfSigned: true }).then(keys => {
      fs.writeFile(config.get('NODE_KEY'), keys.serviceKey, () => { });
      fs.writeFile(config.get('NODE_CERT'), keys.certificate, () => { });

      return {
        key: keys.serviceKey,
        cert: keys.certificate
      };
    });
  }

  this.initKeys = () => {
    return this.readKeys().then(keys => {
      if (keys) {
        return Promise.resolve(keys);
      }
      return this.createKeys();
    });
  }

  return this.initKeys().then(keys => {
    global.KEY = keys.key;
    global.CERT = keys.cert;
  });

  function createCertificate() {
    return generate().then(keys => {
      return Promise.fromCallback(callback => callback(null, keys));
    });
  }
}
