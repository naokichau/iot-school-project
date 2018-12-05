const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['controller', 'sensor'],
        required: true
    },
    specific: {
        type: String,
        enum: ['nodemcu01', 'dht11'],
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    latestData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeviceData"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true,
});

module.exports = deviceSchema;