const mongoose = require("mongoose");

const DeviceData = mongoose.model("DeviceData");
const Device = mongoose.model("Device");

const saveData = (deviceData) => {
    const record = new DeviceData(deviceData);
    return record.save();
};

const findDeviceDataByDeviceId = (deviceId) => DeviceData.find({
    deviceId: deviceId
});

module.exports = {
    saveData,
    findDeviceDataByDeviceId,
};