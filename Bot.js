/* 22032020 Bot - Aedan Cabahug */

const bot = {};
bot.workspace = {};
bot.version = "2.0.0";

bot.library = {};
bot.library.modules = {};
bot.library.require = function (lib) {
  if (typeof bot.library.modules[lib] != "undefined") return;
  var mod = require(__dirname + "/" + lib + ".js");
  if (mod) {
    bot.library.modules[lib] = mod;
    bot.library.modules[lib].x_mod = false;
  }
};

bot.library.getService = bot.getService = function (lib) {
  return bot.library.modules[lib] || null;
};

bot.library.requireModule = function (m) {
  if (typeof bot.library.modules[m] != "undefined") return;
  var mod = require(m);

  if (typeof mod == "undefined") return;
  bot.library.modules[m] = mod;
  bot.library.modules[m].x_mod = true;
};

bot.library._requireModule = function (m) {
  return require(m);
};

bot.library.preloadService = function (mod) {
  if (bot.library.getService(mod) == null) return;
  bot.library.getService(mod).preload(bot);
};

bot.library.loadService = function (mod) {
  if (bot.library.getService(mod) == null) return;
  bot.library.getService(mod).load(bot);
}

bot.variables = {};
bot.variables.vars = Object.create(null);
bot.variables.define = function (name) {
  bot.variables.vars[name] = null;
};

bot.variables.remove = function (name) {
  delete bot.variables.vars[name];
};

bot.variables.exists = function (name) {
  return bot.variables.vars[name] != undefined;
};

bot.variables.setValue = function (name, type, value) {
  if (!bot.variables.exists(name)) return -1;

  switch (type) {
    case 0: // Integers / Floats / Doubles
      bot.variables.vars[name] = parseFloat(value);
      break;
    case 1: // Booleans
      bot.variables.vars[name] = value == "true";
      break;
    case 2: // Strings
      bot.variables.vars[name] = value;
      break;
    case 3: // Functions / Classes
      bot.variables.vars[name] = new Function(value);
      break;
    case 4: // Objects
    case 5: // Arrays
      bot.variables.vars[name] = JSON.parse(value);
      break;
    case 6: // Null
      bot.variables.vars[name] = null;
      break;
  }

  return 1;
};

bot.variables.setRawValue = function (name, value) {
  if (!bot.variables.exists(name)) return -1;

  bot.variables.vars[name] = value;

  return 1;
};

bot.variables.variableList = function () {
  return Object.keys(bot.variables.vars);
};

bot.exit = function () {
  process.exit();
};

global.bot = bot;

bot.library.requireModule("fs");
bot.library.require("ClientAttachment");
bot.library.require("Terminal");
bot.library.preloadService("ClientAttachment");
bot.library.loadService("ClientAttachment");
