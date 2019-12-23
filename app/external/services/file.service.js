const compressing = require('compressing');
const fs = require('fs');
const path = require('path');
const pump = require('pump');
const config = require('nconf');
const logger = require('winston');
const { promisify } = require('util');
const { encode } = require('url-safe-base64');
const { sumBy } = require('lodash');

const readDirAsync = promisify(fs.readdir);

let MOVIE_DIR;
let TV_DIR;
let PACKAGING_DIR;

exports.compressMovie = function (inputPath) {
  // Verify dir is configured before trying to zip
  if (!getMovieDir()) {
    const err = new Error('Movie directory does not exist.');
    err.httpCode = 404;
    return Promise.reject(err);
  }

  const compressStream = new compressing.tgz.Stream();
  compressStream.addEntry(moviePath(inputPath));
  const destStream = fs.createWriteStream(packagingPath(inputPath));

  return new Promise((resolve, reject) => {
    pump(compressStream, destStream, (err) => { if (!err) { resolve(); } else { reject(err); } });
  })
}

exports.compressTvShow = function (inputPath) {
  // Verify dir is configured before trying to zip
  if (!getTvDir()) {
    const err = new Error('TV directory does not exist.');
    err.httpCode = 404;
    return Promise.reject(err);
  }

  const compressStream = new compressing.tgz.Stream();
  compressStream.addEntry(tvPath(inputPath));
  const destStream = fs.createWriteStream(packagingPath(inputPath));

  return new Promise((resolve, reject) => {
    pump(compressStream, destStream, (err) => { if (!err) { resolve(); } else { reject(err); } });
  })
}

exports.removePackagedFile = function(inputPath) {
  fs.unlinkSync(packagingPath(inputPath));
}

exports.getExistingMoviesMap = function() {
  return mapDir(getMovieDir(), { extensions: /\.(mp4|mkv|avi|m4v)$/g, basePath: getMovieDir() });
}

exports.getExistingTvShowsMap = function() {
  return mapDir(getTvDir(), { extensions: /\.(mp4|mkv|avi|m4v)$/g, basePath: getTvDir() });
}

exports.packagingPath = packagingPath;
exports.getPathFromHash = getPathFromHash;

// ===========================================================================

function getMovieDir() {
  if (!MOVIE_DIR) { MOVIE_DIR = config.get('MOVIE_DIR') || '/movies'; }

  if (!fs.existsSync(MOVIE_DIR)) {
    // Try looking in relative path
    if (fs.existsSync(`.${MOVIE_DIR}`)) {
      MOVIE_DIR = `.${MOVIE_DIR}`
    } else {
      MOVIE_DIR = null;
    }
  }
  return MOVIE_DIR;
}

function getTvDir() {
  if (!TV_DIR) { TV_DIR = config.get('TV_DIR') || '/tv_shows'; }

  if (!fs.existsSync(TV_DIR)) {
    // Try looking in relative path
    if (fs.existsSync(`.${TV_DIR}`)) {
      TV_DIR = `.${TV_DIR}`
    } else {
      TV_DIR = null;
    }
  }
  return TV_DIR;
}

function moviePath(relPath) {
  return path.resolve(`${getMovieDir()}/${relPath}`);
}

function tvPath(relPath) {
  return path.resolve(`${getTvDir()}/${relPath}`);
}

function packagingPath(relPath) {
  if (!PACKAGING_DIR) { PACKAGING_DIR = initPackagingPath(); }

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

function filePathToHash(filePath) {
  return encode(Buffer.from(filePath).toString('base64'));
}

function getPathFromHash(hash) {
  return Buffer.from(hash, 'base64').toString('ascii');
}

// Options can contain a whitelisted list of file extensions expressed as a regex.
function mapDir(dirPath, options = {}) {
  return readDirAsync(dirPath).then(files => {
    const dirMap = [];
    const promises = [];
    for (var i = 0; i < files.length; i++) {
      const filePath = `${dirPath}/${files[i]}`;
      const stats = fs.statSync(filePath);

      if (options.extensions && stats.isFile() && !files[i].match(options.extensions)) {
        continue;
      }

      const token = options.basePath ? filePathToHash(path.relative(options.basePath, filePath)) : filePathToHash(filePath);
      const details = {
        token,
        name: files[i],
        isDir: stats.isDirectory(),
        size: stats.size,
        children: [],
      };
      if (details.isDir) {
        promises.push(mapDir(filePath, options).then(map => { details.children = map; details.size = details.size  + sumBy(map, 'size')}));
      }
      dirMap.push(details);
    }
    return Promise.all(promises).then(() => dirMap);
  });
}
