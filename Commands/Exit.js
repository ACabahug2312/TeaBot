register(function (parameters, player) {
  bot.getService("PlayerManager").save(function () {
    bot.exit();
  });
}, "exit", "Stops all the modules in the bot", 1, null, null, null)
