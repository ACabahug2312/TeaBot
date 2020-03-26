register(function (parameters, player) {
  var chat = bot.getService("ChatManager").send;
  var setTimeout = variable("setTimeout").bind(this);
  switch (["list", "disconnect", "reboot", "connect", "hardreset", "hr", "resetall", "ra", "status"].indexOf(parameters[0].toLowerCase())) {
    case 0:
      chat("Service List: " + Object.keys(bot.library.modules).filter(function (module) {
        return typeof bot.library.modules[module].loaded == "boolean";
      }).join(", "));
      break;
    case 1:
      var target = bot.library.modules[parameters[1]];
      if (typeof target == "undefined" || target == null)
        return chat("Unknown service " + parameters[1]);
      if (!target.loaded)
        return chat("The service " + parameters[1] + " is not loaded!");
      chat("Disconnecting " + parameters[1] + " (⚠ Caution! May cause the bot to crash! ⚠)");
      target.collapse();
      chat("The service " + parameters[1] + " has been disconnected");
      break;
    case 2:
      var target = bot.library.modules[parameters[1]];
      if (typeof target == "undefined" || target == null)
        return chat("Unknown service " + parameters[1]);
      chat("Rebooting " + parameters[1] + "... (⚠ Caution! May cause the bot to crash! ⚠)");
      target.collapse();
      try {
        setTimeout(function () {
          target.preload(bot);
          setTimeout(function () {
            target.load(bot);
            chat("Successfully rebooted " + parameters[1]);
          }, 500);
        }, 1000);
      } catch (e) {
        chat("Could not reboot" + parameters[1] + "! Check the terminal for the exception");
        throw e;
      }
      break;
    case 3:
      var target = bot.library.modules[parameters[1]];
      if (typeof target == "undefined" || target == null)
        return chat("Unknown service " + parameters[1]);
      if (target.loaded)
        return chat("The service " + parameters[1] + " is already loaded!");
      chat("Connecting " + parameters[1] + "...");
      try {
        setTimeout(function () {
          target.preload(bot);
          setTimeout(function () {
            target.load(bot);
            chat("Successfully connected " + parameters[1]);
          }, 500);
        }, 1000);
      } catch (e) {
        chat("Could not load" + parameters[1] + "! Check the terminal for the exception");
        throw e;
      }
      break;
    case 4:
    case 5:
      var target = bot.library.modules[parameters[1]];
      if (typeof target == "undefined" || target == null)
        return chat("Unknown service " + parameters[1]);
      target.collapse();
      chat("Hard resetting " + parameters[1] + "... (⚠ Caution! May cause the bot to crash! ⚠)");
      delete bot.library.modules[parameters[1]];
      try {
        setTimeout(function () {
          bot.library.require(parameters[1]);
          setTimeout(function () {
            var mod = bot.library.getService(parameters[1]);
            if (mod == null || typeof mod == "undefiend")
              throw new Error("Service is null");
            if (typeof mod.preload == "function") {
              mod.preload(bot);
              setTimeout(function () {
                mod.load(bot);
                chat("Service " + parameters[1] + " successfully reset!");
              }, 500);
            }
          }, 500);
        }, 1000);
      } catch (e) {
        chat("Could not reset " + parameters[1] + "! Check the terminal for the exception");
        throw e;
      }
      break;
    case 6:
    case 7:
      chat("Resetting all services... (⚠ Caution! May cause the bot to crash! ⚠)");
      var original = Object.keys(bot.library.modules);
      Object.keys(bot.library.modules).forEach(function (module) {
        var o = bot.library.getService(module);
        if (o.x_mod) return;
        o.collapse();
        setTimeout(function () {
          delete bot.library.modules[module];
          bot.library.require(module);
          var mod = bot.library.getService(module);

          setTimeout(function () {
            if (mod == null || typeof mod == "undefiend")
              throw new Error("Service is null");

              if (typeof mod.preload == "function") {
                mod.preload(bot);
                setTimeout(function () {
                  mod.load(bot);
                }, 500);
              }
          }, 500);
        }, 1000);
      });

      var online = 0;
      var offline = [];
      original.forEach(function (module) {
        if (bot.library.modules[module] == null || typeof bot.library.modules[module] == "undefined")
          return offline.push(module);
        else online ++;
      });

      chat(online + "/" + original.length + " services have been reloaded successfully.");
      if (offline.length > 0) chat("Offline services: " + offline.join(", "));
      break;
    case 8:
      var target = bot.library.modules[parameters[1]];
      if (typeof target == "undefined" || target == null || target.x_mod)
        return chat("Unknown service " + parameters[1]);
      chat("Service " + parameters[1] + " is " + (target.loaded ? "Online" : "Offline"));
      break;
    default:
      return chat("Invalid Instructions! [" + parameters[0] + "] (Valid instructions: list, disconnect, reboot, connect, hardreset, hr, status)");
  }
}, "service", "Service manager", 1, 1, null, null)
