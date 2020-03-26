const logger = {};
logger.data = [];
logger.step = true;
logger.loaded = true;
logger.log = function (message) {
  logger.data.push(message);

  console.log(message);
};
logger.step = function (message) {
  if (!logger.steps) return;

  logger.data.push("Step: " + message);
  console.log("Step " + message);
}
logger.saveData = function () {
  var fs = bot.loadLibrary("fs");
  fs.writeFile(__dirname + "logs/log_" + new Date().getTime() + ".txt", bot.logger.data.join("\n"), "utf8");
};
logger.collapse = function () {};

module.exports = logger;
