register(function (parameters, player) {
  var send = bot.getService("ChatManager").send;
  var beg = Date.now();

  try {
    send("Output: " + JSON.stringify(eval(parameters.join(" "))) + " (" + (Date.now() - beg) + " ms)");
  } catch (e) {
    send("Error: " + e.toString());
  }
}, "script", "Runs a script", 1, null, null, null)
