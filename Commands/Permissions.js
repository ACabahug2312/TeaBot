register(function (parameters, player) {
  var chat = bot.getService("ChatManager").send;
  switch (["get", "set", "reset"].indexOf(parameters[0])) {
    case 0:
      if (bot.getService("PlayerManager").getPlayer(null, parameters[1]) == null)
        return chat("Could not find the player");
      chat("Access level of " + bot.getService("PlayerManager").getPlayer(null, parameters[1]).name + " #" + parameters[1] + ": " + bot.getService("PlayerManager").getPlayer(null, parameters[1]).level);
      break;
    case 1:
      if (isNaN(parameters[2])) return chat("Invalid level number");
      if (bot.getService("PlayerManager").getPlayer(null, parameters[1]) == null)
        return chat("Could not find the player");
      bot.getService("PlayerManager").setLevel(parameters[1], parameters[2]);
      chat("Access level of " + bot.getService("PlayerManager").getPlayer(null, parameters[1]).name + " #" + bot.getService("PlayerManager").getPlayer(null, parameters[1]).id + " set to " + parameters[2])
      break;
    case 2:
      bot.getService("PlayerManager").players = {};
      bot.getService("PlayerManager").players[bot.workspace.currentPlayer.id] = 1;
      chat("All access levels have been reset");
      break;
    default:
      chat("Parameter 1 must be get, set, or reset");
      break;
  }
}, "permissions", "Permissions", 1, 1, null, null)
