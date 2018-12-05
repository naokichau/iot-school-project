const mongoose = require("mongoose");
const md5 = require("md5");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    pubkey: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = userSchema;