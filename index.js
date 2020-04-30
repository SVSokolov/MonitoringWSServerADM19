const io = require('socket.io')();

console.log("Server started!!!");

io.on('connection', client => {
    console.log("Client connected");

    client.on('event', data => {
        console.log(data);
    });

    client.on('disconnect', () => {
        console.log("Disconnected");
    });
});

io.listen(6543);