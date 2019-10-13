const compressing = require('compressing');
const fs = require('fs');
const path = require('path');
const pump = require('pump');
const config = require('nconf');
const logger = require('winston');

let MOVIE_DIR;
let TV_DIR;
let PACKAGING_DIR;

exports.compressMovie = function (inputPath) {
  if (!MOVIE_DIR) { MOVIE_DIR = config.get('MOVIE_DIR') || '/movies'; }
  if (!PACKAGING_DIR) { PACKAGING_DIR = initPackagingPath(); }

  if (!fs.existsSync(MOVIE_DIR)) {
    // Try looking in relative path
    if (fs.existsSync(`.${MOVIE_DIR}`)) {
      MOVIE_DIR = `.${MOVIE_DIR}`
    } else {
      const err = new Error('Movie directory does not exist.');
      err.httpCode = 404;
      return Promise.reject(err);
    }
  }

  logger.info('**** compress path:', moviePath(inputPath));
  const compressStream = new compressing.tgz.Stream();
  compressStream.addEntry(moviePath(inputPath));
  const destStream = fs.createWriteStream(packagingPath(inputPath));

  return new Promise((resolve, reject) => {
    pump(compressStream, destStream, (err) => { if (!err) { resolve(); } else { reject(err); } });
  })
}

exports.compressTvShow = function (inputPath) {
  if (!TV_DIR) { TV_DIR = config.get('TV_DIR') || '/tv_shows'; }
  if (!PACKAGING_DIR) { PACKAGING_DIR = initPackagingPath(); }

  if (!fs.existsSync(TV_DIR)) {
    // Try looking in relative path
    if (fs.existsSync(`.${TV_DIR}`)) {
      TV_DIR = `.${TV_DIR}`
    } else {
      const err = new Error('TV directory does not exist.');
      err.httpCode = 404;
      return Promise.reject(err);
    }
  }

  const compressStream = new compressing.tgz.Stream();
  compressStream.addEntry(tvPath(inputPath));
  const destStream = fs.createWriteStream(packagingPath(inputPath));

  return new Promise((resolve, reject) => {
    pump(compressStream, destStream, (err) => { if (!err) { resolve(); } else { reject(err); } });
  })
}

exports.packagingPath = packagingPath;

exports.removePackagedFile = function(inputPath) {
  fs.unlinkSync(packagingPath(inputPath));
}

function moviePath(relPath) {
  return path.resolve(`${MOVIE_DIR}/${relPath}`);
}

function tvPath(relPath) {
  return path.resolve(`${TV_DIR}/${relPath}`);
}

function packagingPath(relPath) {
  const fileName = `${path.parse(relPath).name}.tar`;
  return path.resolve(`${PACKAGING_DIR}/${fileName}`);
}

function initPackagingPath() {
  const path = config.get('PACKAGING_DIR') || '/packaging';
  if (fs.existsSync(path)) { return path; }

  const tempPath = `.${path}`;
  if (!fs.existsSync(tempPath)) {
    logger.warn(`Volume ${path} does not exist, creating temp dir.`);
    fs.mkdirSync(tempPath);
  }
  return tempPath;
}
