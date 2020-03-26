const channel = {};
channel.currentChannel = null;
channel.playerManager = null;
channel.loaded = false;
channel.preload = function () {
  bot.library.require("PlayerManager");
  bot.library.require("EventManager");
};

channel.load = function () {
  channel.playerManager = bot.library.getService("PlayerManager");
  channel.eventManager = bot.library.getService("EventManager");
  channel.loaded = true;
};

channel.createChannel = function (object) {
  return {
    players: object.ppl.map(function (player) { return channel.playerManager.createPlayer(player); }),
    name: object.ch._id
  };
};

channel.channelUpdate = function (object) {
  if (channel.currentChannel == null || object.name != channel.currentChannel.name)
    channel.eventManager.triggerEvent("channel update", object);
  channel.currentChannel = object;
  channel.eventManager.triggerEvent("channel data", object);
};

channel.setChannel = function (channelID) {
  bot.workspace.currentClient.sendArray([{ m: "ch", _id: channelID }]);
};

channel.collapse = function () {
  channel.currentChannel = null;
  channel.playerManager = null;
  channel.loaded = false;
};

module.exports = channel;
