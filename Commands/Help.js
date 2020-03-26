register(function (parameters, player) {
  var send = bot.getService("ChatManager").send;
  var commands = Object.keys(bot.getService("CommandManager").commands).filter(function (command) {
    return bot.getService("CommandManager").commands[command].level <= player.level;
  });

  send("Commands you can access [AL=" + player.level + "]: " + commands.map(function (command) {
    return command + " [" + bot.getService("CommandManager").commands[command].level + "]";
  }).join(", "));
}, "help", "Shows a list of commands", 0, null, null, null)
