const filemanager = {};
filemanager.fs = null;
filemanager.loaded = false;
filemanager.preload = function () {
  bot.library.requireModule("fs");
};
filemanager.load = function () {
  filemanager.fs = bot.library.getService("fs");
  filemanager.loaded = true;
};
filemanager.readFile = function (file) {
  return filemanager.fs.readFileSync(__dirname + "/" + file, "utf8");
};
filemanager.fileList = function (directory) {
  return filemanager.fs.readdirSync(__dirname + "/" + directory);
};
filemanager.fileExists = function (file) {
  return filemanager.fs.existsSync(__dirname + "/" + file);
};
filemanager.dirExists = function (directory) {
  return filemanager.fs.existsSync(__dirname + "/" + directory);
};
filemanager.createDir = function (directory) {
  filemanager.fs.mkdirSync(__dirname + "/" + directory);
};
filemanager.removeDir = function (directory) {
  filemanager.fs.rmdirSync(__dirname + "/" + directory); // Caution: Recursive errors
};
filemanager.writeFile = function (file, contents) {
  filemanager.fs.writeFileSync(__dirname + "/" + file, contents, "utf8");
};
filemanager.collapse = function () {
  filemanager.fs = null;
  filemanager.loaded = false;
};

module.exports = filemanager;
