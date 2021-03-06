
const port = 1224;

let game = require("./game");
let client_id_count = 0;

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: port });

server.on('connection', function (socket) {
    socket.id = client_id_count;
    game.init_player(socket.id);
    console.log("players: ", game.players.size);

    socket.on('message', function (message) {
        game.get_client_message(socket.id, JSON.parse(message));
    });
    socket.on('close', function () {
        game.players.delete(socket.id);
        console.log("players: ", game.players.size);
    });

    socket.send(JSON.stringify({ type: "me", data: socket.id }));
    client_id_count++;
});

setInterval(() => { game.update(server); }, 16);