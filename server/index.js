const url = require('url');
const http = require('http');
const WebSocket = require('ws');
const constvar = require("./constants.js");
const mongoose = require('mongoose');
const server = http.createServer();
const utils = require("./utilities.js");
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
    mongoose.Promise = global.Promise;

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGHUP", cleanup);

    server.listen(constvar.port);
});

mongoose.connect(constvar.mongoEndPoint);

function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}

function eventFn(eventName, doc) {
    console.log(eventName, doc)
    switch (eventName) {
        case 'newrecord':
            device.findAndUpdate(doc.deviceId, doc._id).exec((err, r) => {
                setTimeout(() => {
                    if (userConnList.length > 0) {
                        device.findDevicesByOwnerId(userInfo.id).exec((err, res) => {
                            console.log(res)
                            userConnList[0].conn.send(JSON.stringify({
                                msgType: 'devicelist',
                                data: res
                            }))
                        })
                    }
                }, 500)
            })
            break;
        default:
            break;
    }
}

require('./models/models')(mongoose, eventFn);
const user = require('./controllers/user')
const device = require('./controllers/device')
const deviceRecord = require('./controllers/devicedata')
const gateway = require('./controllers/gateway')

const wssUser = new WebSocket.Server({
    noServer: true
});
const wssGateway = new WebSocket.Server({
    noServer: true
});

var userConnList = [];
var gatewayConnList = [];

// setInterval(() => {
//     deviceRecord.saveData({
//         deviceId: '1',
//         data: JSON.stringify({
//             temp: 28,
//             humid: 60,
//         })
//     })
//     deviceRecord.saveData({
//         deviceId: '2',
//         data: JSON.stringify({
//             door: '0',
//             fan: '0',
//             light: '1'
//         })
//     })
// }, 5000)

// setInterval(() => {
//     deviceRecord.saveData({
//         deviceId: '1',
//         data: JSON.stringify({
//             temp: 29,
//             humid: 80,
//         })
//     })
//     deviceRecord.saveData({
//         deviceId: '2',
//         data: JSON.stringify({
//             door: '1',
//             fan: '3',
//             light: '2'
//         })
//     })
// }, 7000)

// setTimeout(() => {
//     user.findUserByPk("QaiY+CwTOF7InPg2On066n8efLgo7kGnmjKJUq0whMY=").exec((err, res) => {
//         device.registerDevice({
//             id: res._id
//         }, {
//             deviceId: '1',
//             type: 'sensor',
//             location: 'living-room',
//             name: 'Room sensor',
//             specific: 'dht11'
//         })
//         device.registerDevice({
//             id: res._id
//         }, {
//             deviceId: '2',
//             type: 'controller',
//             location: 'living-room',
//             name: 'Room controller',
//             specific: 'nodemcu01'
//         });
//     })

// }, 3000)

// setTimeout(() => {
//     user.saveUser({
//         pubkey: "QaiY+CwTOF7InPg2On066n8efLgo7kGnmjKJUq0whMY=",
//         name: "lam"
//     })
// }, 2000)

wssUser.on('connection', (ws, req) => {
    console.log("a user connected")
    isVerify = false;
    userInfo = {
        conn: ws
    };
    ws.on('message', (message) => {
        console.log(message)
        try {
            var msg = JSON.parse(message)
            if (isVerify) {
                switch (msg.msgType) {
                    case "cmd":
                        if (gatewayConnList.length > 0) {
                            gatewayConnList[0].conn.send(message)
                        } else {
                            ws.send(JSON.stringify({
                                msgType: 'gatewayoffline'
                            }))
                        }
                        break;
                    case "getmydevices":
                        device.findDevicesByOwnerId(userInfo.id).exec((err, res) => {
                            ws.send(JSON.stringify({
                                msgType: 'devicelist',
                                data: res
                            }))
                            if (gatewayConnList.length > 0) {
                                gatewayConnList[0].conn.send(JSON.stringify({
                                    msgType: 'request',
                                    deviceId: '2'
                                }))
                            } else {
                                ws.send(JSON.stringify({
                                    msgType: 'gatewayoffline'
                                }))
                            }
                        })
                        break;
                    case "getdevicerecord":
                        deviceRecord.findDeviceDataByDeviceId(msg.data.deviceId).exec((err, res) => {
                            ws.send(JSON.stringify({
                                msgType: 'devicerecord',
                                data: {
                                    deviceId: msg.data.deviceId,
                                    records: res,
                                }
                            }))
                        });
                        break;
                    case "editdeviceinfo":

                        break;
                    default:
                        ws.send("leu leu :P")
                        // ws.terminate()
                        break;
                }
            } else {
                switch (msg.msgType) {
                    case "login":
                        user.findUserByPk(msg.pkey).exec((err, res) => {
                            console.log(err, res)
                            isVerify = utils.verifySig(msg.data, msg.sig, msg.pkey);
                            if (isVerify) {
                                respond = {
                                    "msgType": "logined",
                                    "status": "200"
                                }
                                userInfo.id = res._id;
                                ws.send(JSON.stringify(respond));
                                userConnList.push(userInfo);
                            } else {
                                ws.send("leu leu :P")
                            }
                        })
                        break;
                    case "register":

                        break;
                    default:
                        ws.send("leu leu :P");
                        ws.terminate();
                        break;
                }
            }
        } catch (error) {
            console.error("incorrect msg format: " + error);
            ws.send("leu leu :P")
        }
    });
    ws.on('close', (code, reason) => {
        console.log(code, reason)
        userConnList.splice(userConnList.indexOf(userInfo), 1);
    })
});
wssGateway.on('connection', (ws, req) => {
    console.log("a gateway connected");
    gatewayInfo = {
        conn: ws
    };
    gatewayConnList.push(gatewayInfo);
    ws.on('message', (message) => {
        try {
            console.log(message);
            var msg = JSON.parse(message);
            switch (msg.msgType) {
                case "devicedata":
                    msg.data.devices.forEach(device => {
                        deviceRecord.saveData(device)
                    });
                    break;
                case "register":
                    break;
                default:
                    ws.send("leu leu :P");
                    // ws.terminate();
                    break;
            }
        } catch (error) {
            console.error("incorrect msg format: " + error + " " + message);
        }

    });
    ws.on('close', (code, reason) => {
        console.log(code, reason)
        gatewayConnList.splice(gatewayConnList.indexOf(gatewayInfo), 1);
    })
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

// server.on('request', function (req, socket, head) {
//     var parsedURL = url.parse(req.url, true);
//     console.log(parsedURL, req.method)

//     switch (req.method) {
//         case "GET":

//             break;
//         case "POST":

//             break;
//         case "PUT":
//             break;
//         default:
//             socket.write("ಠ_ಠ nani kore?")
//             break;
//     }
//     socket.end()

// });