register(function (parameters, player) {
  bot.getService("ChatManager").send(
    "Services: " + (
      Object.keys(bot.library.modules).map(function (module) {
        return module + " (" + (bot.library.modules[module].loaded ? "Online" : "Offline") + ")";
      }).join(", ")
    ) + "; Applications: Bot (Online), Terminal (" + (bot.getService("Terminal").online ? "Online" : "Offline") + ")"
  );
}, "status", "Shows status of all services", 1, null, null, null)
