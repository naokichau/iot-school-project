const mongoose = require("mongoose");

const Device = mongoose.model("Device");
const User = mongoose.model("User");

const registerDevice = (user, data) => {
    return new Promise((resolve, reject) => {
        const {
            id
        } = user;

        const device = new Device(data);
        User.findOne({
            _id: id
        }).exec((err, res) => {
            device.ownerId = res;
            return device.save();
        })
    })
}

const findDevicesByOwnerId = (ownerID) => Device.find({
    ownerId: ownerID
}).populate('latestData');

const findDevice = (id) => Device.findOne({
    _id: id
});

const findDeviceBySerial = (id) => Device.findOne({
    deviceId: id
});
const findAndUpdate = (id, data) => Device.update({
    deviceId: id
}, {
    latestData: data
})
module.exports = {
    registerDevice,
    findDevicesByOwnerId,
    findDevice,
    findAndUpdate
};