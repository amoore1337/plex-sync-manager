const compressing = require('compressing');
const fs = require('fs');
const path = require('path');
const pump = require('pump');
const config = require('nconf');
const logger = require('winston');

let MEDIA_DIR;
let PACKAGING_DIR;

exports.compressDir = function (inputPath) {
  if (!MEDIA_DIR) { MEDIA_DIR = initPath(config.get('MEDIA_DIR') || '/media'); }
  if (!PACKAGING_DIR) { PACKAGING_DIR = initPath(config.get('PACKAGING_DIR') || '/packaging'); }

  const compressStream = new compressing.tgz.Stream();
  compressStream.addEntry(mediaPath(inputPath));
  const destStream = fs.createWriteStream(packagingPath(inputPath));

  // return compressing.tgz.compressDir(mediaPath(inputPath), packagingPath(inputPath));
  return new Promise((resolve, reject) => {
    pump(compressStream, destStream, (err) => { if (!err) { resolve(); } else { reject(err); } });
  })
}

exports.packagingPath = packagingPath;

exports.removePackagedFile = function(inputPath) {
  fs.unlinkSync(packagingPath(inputPath));
}

function mediaPath(relPath) {
  return path.resolve(`${MEDIA_DIR}/${relPath}`);
}

function packagingPath(relPath) {
  const fileName = `${path.parse(relPath).name}.tar`;
  return path.resolve(`${PACKAGING_DIR}/${fileName}`);
}

function initPath(path) {
  if (volumeExists(path)) { return path; }

  const tempPath = `.${path}`;
  if (!volumeExists(tempPath)) {
    logger.warn(`Volume ${path} does not exist, creating temp dir.`);
    fs.mkdirSync(tempPath);
  }
  return tempPath;
}

function volumeExists(path) {
  return fs.existsSync(path);
}
