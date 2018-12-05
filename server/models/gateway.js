const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gatewaySchema = new Schema({
    serial: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true,
});

module.exports = gatewaySchema;