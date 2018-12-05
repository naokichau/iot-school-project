const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceDataSchema = new Schema({
    deviceId: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = deviceDataSchema;