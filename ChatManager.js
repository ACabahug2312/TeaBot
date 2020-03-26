const chat = {};
chat.commandManager = null;
chat.playerManager = null;
chat.eventManager = null;
chat.logger = null;
chat.buffer = [];
chat.loaded = false;
chat.preload = function () {
  bot.library.require("CommandManager");
  bot.library.require("PlayerManager");
  bot.library.require("EventManager");
  bot.library.require("Logger");

  bot.library.preloadService("CommandManager");
};
chat.load = function () {
  chat.commandManager = bot.library.getService("CommandManager");
  chat.playerManager = bot.library.getService("PlayerManager");
  chat.eventManager = bot.library.getService("EventManager");
  chat.logger = bot.library.getService("Logger");
  bot.library.loadService("CommandManager");

  chat.eventManager.registerHandler("a", function (data) {
    chat.chatMessage(data.a, chat.playerManager.createPlayer(data.p));
  });

  setInterval(function () {
    var message = chat.buffer.shift();

    if (!message) return;
    if (message.length > 511) {
      var pre = message.slice(0, 511) + "…";
      var aft = "…" + message.slice(511);

      chat.buffer.push(aft);
      bot.workspace.currentClient.sendArray([{ m: "a", message: pre }]);
    } else bot.workspace.currentClient.sendArray([{ m: "a", message: message }]);
  }, 1600);

  chat.loaded = true;
};
chat.send = function (message) {
  chat.buffer.push(message);
};
chat.chatMessage = function (message, player) {
  chat.logger.log(player.name + "#" + player.id + ": " + message);
  chat.commandManager.onChat(message, player);
  if (bot.library.getService("Terminal") == null) return;
  bot.library.getService("Terminal").send(message, player);
};
chat.collapse = function () {
  chat.commandManager = null;
  chat.playerManager = null;
  chat.eventManager = null;
  chat.logger = null;
  chat.buffer = [];
  chat.loaded = false;
};

module.exports = chat;
