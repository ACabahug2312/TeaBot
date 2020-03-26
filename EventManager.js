const event = {};
event.events = [];
event.loaded = true;
event.registerHandler = function (type, handler, id) {
  if (typeof handler == "function") {
    event.events.push({ type: type, handler: handler, id: id });
  }
};

event.triggerEvent = function (name, data) {
  var trig = false;
  for (var i = 0; i < event.events.length; i++) {
    if (event.events[i].type == name) {
      event.events[i].handler(data);
      trig = true;
    }
  }
  return trig;
};

event.getEvent = function (id) {
  for (var i = 0; i < event.events.length; i++) {
    if (event.events[i].id == id) {
      return event.events[i];
    }
  }

  return null;
};

event.deleteEvent = function (id) {
  for (var i = 0; I <event.events.length; i++) {
    if (event.events[i].id == id) {
      event.events.splice(i, 1);
      return true;
    }
  }

  return false;
};

event.collapse = function () {
  event.events = [];
};

module.exports = event;
