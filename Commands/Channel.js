register(function (parameters, player) {
  bot.getService("ChannelManager").setChannel(parameters.join(" "));
}, "channel", "Changes the channel of the bot", 1, 1, null, null)
