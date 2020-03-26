const terminal = {};
terminal.app = null;
terminal.server = null;
terminal.logger = null;
terminal.files = null;
terminal.io = null;
terminal.online = false;
terminal.loaded = false;
terminal.preload = function () {
  bot.library.requireModule("express");
  bot.library.requireModule("http");
  bot.library.requireModule("socket.io");
  bot.library.require("FileManager");
  bot.library.require("logger");
};

terminal.load = function () {
  terminal.app = bot.library.getService("express")();
  terminal.server = bot.library.getService("http").createServer(terminal.app);
  terminal.files = bot.library.getService("FileManager");
  terminal.logger = bot.library.getService("logger");
  terminal.io = bot.library.getService("socket.io")(terminal.server);

  terminal.app.get("/", function (request, resolution) {
    resolution.send(terminal.files.readFile("Terminal/terminal.html"));
  });

  terminal.io.on("connection", function (socket) {
    socket.emit("prefix", bot.library.getService("CommandManager").prefix);
    socket.on("chat", function (message) {
      bot.library.getService("ChatManager").send(message);
    });
  });

  terminal.io.on("connect", function () {
    terminal.online = true;
  });

  terminal.io.on("disconnect", function () {
    terminal.online = false;
  });

  setInterval(function () {
    if (bot.getService("ChannelManager").currentChannel != null) {
      terminal.io.emit("channel", bot.getService("ChannelManager").currentChannel.name);
    }
  }, 1000);

  terminal.server.listen(8080, function () {
    terminal.logger.log("Terminal is being hosted on localhost:8080");
    terminal.loaded = true;
  });
};

terminal.send = function (message, player) {
  if (!terminal.online) return;
  if (terminal == null || terminal.io == null) return;
  terminal.io.emit("message", JSON.stringify({
    text: player.name + " #" + player.id + ": " + message,
    color: player.color,
    date: Date.now()
  }));
};

terminal.error = function (error) {
  if (!terminal.online) return;
  if (terminal == null || terminal.io == null) return;
  terminal.io.emit("err", error.stack);
};

terminal.empty = function () {
  if (!terminal.online) return;
  if (terminal == null || terminal.io == null) return;
  terminal.io.emit("empty", "");
}

terminal.collapse = function () {
  terminal.io.close();
  terminal.server.close();
  terminal.app = null;
  terminal.server = null;
  terminal.logger = null;
  terminal.files = null;
  terminal.io = null;
  terminal.online = false;
  terminal.loaded = false;
};

module.exports = terminal;
