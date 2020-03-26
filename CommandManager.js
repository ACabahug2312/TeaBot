const command = {};
command.commands = {};
command.fileManager = null;
command.chatManager = null;
command.playerManager = null;
command.prefix = "厶";
command.loaded = false;
command.preload = function () {
  bot.library.require("FileManager");
  bot.library.require("ChatManager");
  bot.library.require("PlayerManager");
  bot.library.requireModule("vm");
  bot.library.preloadService("FileManager");
};

command.load = function () {
  command.fileManager = bot.library.getService("FileManager");
  command.chatManager = bot.library.getService("ChatManager");
  command.playerManager = bot.library.getService("PlayerManager");
  bot.library.loadService("FileManager");

  var vm = bot.library.getService("vm");

  var commandList = command.fileManager.fileList("Commands");
  for (var i = 0; i < commandList.length; i++) {
    var script = command.fileManager.readFile("Commands/" + commandList[i]);
    vm.runInNewContext(script, {
      bot: bot,
      register: command.register,
      variable: function (property) {
        return this[property];
      }
    });
  }

  command.loaded = true;
};

command.register = function (callback, name, desc, level, min_args, max_args, ex_args) {
  command.commands[name] = {
    callback: callback,
    description: desc,
    level: level,
    min_args: min_args,
    max_args: max_args,
    ex_args: ex_args
  };
};

command.onChat = function (message, player) {
  if (message[0] == command.prefix) {
    var tokens = message.split(" ");
    var cmd = tokens[0].slice(command.prefix.length);
    var parameters = tokens.slice(1);

    if (typeof command.commands[cmd] == "undefined") return command.chatManager.send("Unknown command. Type " + command.prefix + "help for a list of commands.");

    var target = command.commands[cmd];
    if (target.min_args != null && parameters.length < target.min_args)
      return command.chatManager.send("This command requires a minimum of " + target.min_args + " parameters");
    if (target.max_args != null && parameters.length > target.min_args)
      return command.chatManager.send("This command requires a maximum of " + target.min_args + " parameters");
    if (target.ex_args != null  && parameters.length != target.min_args)
      return command.chatManager.send("This command requires exactly " + target.min_args + " parameters");
    if (command.playerManager.getLevel(player.id) < target.level)
      return command.chatManager.send("This command requires a level of " + target.level + " or higher to be accessed. [AL=" + command.playerManager.getLevel(id) + "]");

    try {
      target.callback(parameters, player);
    } catch (e) {
      command.chatManager.send("There was an error while running the command. Check the console to see the error");
      bot.library.getService("Terminal").error(e);
      console.log(e);
    }
  }
};

command.collapse = function () {
  command.commands = {};
  command.fileManager = null;
  command.chatManager = null;
  command.playerManager = null;
  command.prefix = "厶";
  command.loaded = false;
};

module.exports = command;
