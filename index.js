const io = require('socket.io')();
const osu = require('node-os-utils');

var cpu = osu.cpu;
var mem = osu.mem;

const userDB = {
  "User": { pass: "Password", accessLevel: "Guest" }
};

console.log("Server started!!!");

io.on('connection', client => {
  console.log("Client connected");

  client.on('event', data => {
    console.log(data);
  });

  client.on('login', (data, callback) => {
    console.log(data);

    if (callback !== undefined) {
      if ((data !== undefined) &&
        (userDB[data.name] !== undefined) &&
        (userDB[data.name].pass === data.pass)) {
        callback({ success: true, msg: "Login OK", access: userDB[data.name].accessLevel });
      } else {
        callback({ success: false, msg: "Login Failed!!!"});
        client.disconnect(true);
      }
    }
  });

  client.on('disconnect', () => {
    console.log("Disconnected");
  });
});

io.listen(6543);

var hwUsageStat = {
  cpuModel: "",
  cpuCount: 0,
  cpuUsage: 0,
  memUsage: {}
};

function updateHWUtilization() {
  hwUsageStat.cpuCount = cpu.count();
  hwUsageStat.cpuModel = cpu.model();

  cpu.usage().then(cpuPercentage => {
    hwUsageStat.cpuUsage = cpuPercentage;
  });

  mem.info().then(info => {
    hwUsageStat.memUsage = info;
  });
};

setInterval(() => {
  updateHWUtilization();
  io.emit("msg", hwUsageStat);
}, 250);