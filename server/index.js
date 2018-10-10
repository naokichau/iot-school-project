const url = require('url');
const http = require('http');
const WebSocket = require('ws');
const constvar = require("./constants.js");
const server = http.createServer();

const wssUser = new WebSocket.Server({
    noServer: true
});
const wssGateway = new WebSocket.Server({
    noServer: true
});
wssUser.on('connection', (ws, req) => {
    console.log("a user connected")
    ws.on('message', (message) => {
        ws.send("sdgsdgs")
    });

});
wssGateway.on('connection', (ws, req) => {
    console.log("a gateway connected")
    ws.on('message', (message) => {

    });
});
server.on('upgrade', function upgrade(request, socket, head) {
    console.log("websocket connection detected")
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/user') {
        wssUser.handleUpgrade(request, socket, head, function done(ws) {
            wssUser.emit('connection', ws, request);
        });
    } else if (pathname === '/gateway') {
        wssGateway.handleUpgrade(request, socket, head, function done(ws) {
            wssGateway.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.on('request', function (req, socket, head) {
    var parsedURL = url.parse(req.url, true);
    console.log(parsedURL, req.method)

    switch (req.method) {
        case "GET":

            break;
        case "POST":

            break;
        case "PUT":
            break;
        default:
            socket.write("ಠ_ಠ nani kore?")
            break;
    }
    socket.end()

});

server.listen(8080);