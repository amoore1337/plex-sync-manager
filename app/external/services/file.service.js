const compressing = require('compressing');

exports.compressDir = function (inputPath, outputPath) {
  return compressing.tar.compressDir(inputPath, outputPath);
}
