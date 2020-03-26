const player = {};
player.players = [];
player.files = null;
player.levels = null;
player.loaded = false;
player.preload = function () {
  bot.library.require("FileManager");
};

player.load = function () {
  player.files = bot.library.getService("FileManager");

  if (!player.files.fileExists("Permissions/Levels.json"))
    player.files.writeFile("Permissions/Levels.json", "{}");

  player.levels = JSON.parse(player.files.readFile("Permissions/Levels.json"));
  player.loaded = true;
};

player.createPlayer = function (object) {
  return {
    name: object.name,
    id: object._id,
    level: player.getLevel(object._id),
    color: object.color
  }
};

player.getPlayer = function(name, id) {
  for (var i = 0; i < player.players.length; i++) {
    if (name == null) {
      if (player.players[i].id = id) {
        return player.players[i];
      }
    } else {
      if (player.players[i].name == name) {
        return player.players[i];
      }
    }
  }

  return null;
};

player.setLevel = function (id, level) {
  for (var i = 0; i < player.players.length; i++) {
    if (player.players[i].id == id) {
      player.players[i].level = level;
    }
  }
};

player.getLevel = function (id) {
  return player.levels[id] || 0;
};

player.addPlayer = function (p) {
  if (player.getPlayer(p.name) != null) return;
  player.players.push(p);
};

player.removePlayer = function (name, id) {
  for (var i = 0; i < player.players.length; i++) {
    if (name == null) {
      if (player.players[i].id = id) {
        player.players.splice(i, 1);
      }
    } else {
      if (player.players[i].name == name) {
        player.players.splice(i, 1);
      }
    }
  }
};

player.save = function (cb) {
  if (typeof cb != "function") cb = function () {};
  bot.getService("fs").writeFile(__dirname + "/Permissions/Levels.json", JSON.stringify(player.levels), "utf8", cb);
};

player.collapse = function () {
  player.players = [];
  player.files = null;
  player.levels = null;
  player.loaded = false;
}

module.exports = player;
