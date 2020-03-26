register(function (parameters, player) {
  var chat = bot.getService("ChatManager").send;
  var terminalService = bot.getService("Terminal");
  var setTimeout = variable("setTimeout").bind(this);
  switch(["clear", "disconnect", "connect", "push_message", "pm"].indexOf(parameters[0].toLowerCase())) {
    case 0:
      terminalService.empty();
      break;
    case 1:
      if (!terminalService.loaded)
        return chat("Terminal is not connected!");
      terminalService.collapse();
      chat("Terminal has been disconnected");
      break;
    case 2:
      if (terminalService.loaded)
        return chat("Terminal is connected!");
      terminalService.preload();
      setTimeout(function () {
        terminalService.load();
        chat("Terminal has been connected");
      }, 500);
      break;
    case 3:
    case 4:
      terminalService.send(parameters.slice(1).join(" "), {
        name: "PM",
        id: "#2269d635d3bfe6630d9ab034",
        color: "#000000"
      });
      break;
    default:
      chat("Unknown instruction! Valid instructions: clear, disconnect, connect, push_message, pm");
      break;
  }
}, "terminal", "Manages the terminal", 1, 1, null, null)
