const attachment = {};
attachment.client = null;
attachment.logger = null;
attachment.currentClient = null;
attachment.eventManager = null;
attachment.playerManager = null;
attachment.channelManager = null;
attachment.chatManager = null;
attachment.terminal = null;
attachment.loaded = false;
attachment.preload = function () {
  bot.library.require("EventManager");
  bot.library.require("PlayerManager");
  bot.library.require("ChatManager");
  bot.library.require("ChannelManager");
  bot.library.require("Client");
  bot.library.require("Logger");
  bot.library.require("Terminal");

  bot.library.preloadService("ChannelManager");
  bot.library.preloadService("ChatManager");
  bot.library.preloadService("PlayerManager");
  bot.library.preloadService("Terminal");
};

attachment.load = function () {
  attachment.client = bot.library.getService("Client");
  attachment.logger = bot.library.getService("Logger");
  attachment.eventManager = bot.library.getService("EventManager");
  attachment.playerManager = bot.library.getService("PlayerManager");
  attachment.channelManager = bot.library.getService("ChannelManager");
  attachment.chatManager = bot.library.getService("ChatManager");
  attachment.terminal = bot.library.getService("Terminal");

  bot.library.loadService("ChannelManager");
  bot.library.loadService("ChatManager");
  bot.library.loadService("PlayerManager");
  bot.library.loadService("Terminal");

  attachment.logger.log("Starting Bot Client");

  attachment.currentClient = new attachment.client("ws://www.multiplayerpiano.com:8080");
  attachment.currentClient.setChannel("test/awkward");
  attachment.currentClient.startClient();

  bot.workspace.currentClient = attachment.currentClient;

  attachment.currentClient.ws.addEventListener("message", function (evt) {
    var transmission = JSON.parse(evt.data);
    for (var i = 0; i < transmission.length; i++) {
      var msg = transmission[i];
      if (attachment.eventManager == null) continue;
      attachment.eventManager.triggerEvent(msg.m, msg);
    }
  });

  attachment.currentClient.ws.addEventListener("open", function () {
    console.log("Connected");

    attachment.currentClient.sendArray([{ m: "hi" }]);
  });

  attachment.currentClient.ws.addEventListener("close", function () {
    console.log("Disconnected");
    if (attachment.channelManager == null) return;
    attachment.channelManager.currentChannel = null;
  });

  attachment.eventManager.registerHandler("hi", function (data) {
    attachment.playerManager.addPlayer(attachment.playerManager.createPlayer(data.u));
    bot.workspace.currentPlayer = attachment.playerManager.createPlayer(data.u);
  });

  attachment.eventManager.registerHandler("channel update", function (data) {
    attachment.logger.log("Channel update: " + data.name);
  });

  attachment.eventManager.registerHandler("channel data", function (data) {
    attachment.playerManager.players = data.players.map(function (player) {
      return attachment.playerManager.createPlayer(player);
    });
  });

  attachment.eventManager.registerHandler("ch", function (data) {
    attachment.channelManager.channelUpdate(attachment.channelManager.createChannel(data));
  });

  attachment.loaded = true;
};

attachment.collapse = function () {
  attachment.currentClient.stop();
  attachment.client = null;
  attachment.logger = null;
  attachment.currentClient = null;
  attachment.eventManager = null;
  attachment.playerManager = null;
  attachment.channelManager = null;
  attachment.chatManager = null;
  attachment.terminal = null;
  attachment.loaded = false;
};

module.exports = attachment;
