const userSchema = require('./user')
const deviceSchema = require('./device')
const deviceDataSchema = require('./devicedata')
const gatewaySchema = require('./gateway')
module.exports = (mongoose, eventFn) => {
    // userSchema.post('save', (doc) => {
    //     eventFn(doc)
    // });
    // userSchema.post('remove', (doc) => {
    //     eventFn(doc)
    // });
    // deviceSchema.post('save', (doc) => {
    //     eventFn('newrecord',doc)
    // });
    // deviceSchema.post('remove', (doc) => {
    //     eventFn('newrecord',doc)
    // });
    deviceDataSchema.post('save', (doc) => {
        eventFn('newrecord', doc)
    });
    // deviceDataSchema.post('remove', (doc) => {
    //     eventFn(doc)
    // });
    // gatewaySchema.post('save', (doc) => {
    //     eventFn(doc)
    // });
    // gatewaySchema.post('remove', (doc) => {
    //     eventFn(doc)
    // });
    mongoose.model("User", userSchema);
    mongoose.model("Device", deviceSchema);
    mongoose.model("DeviceData", deviceDataSchema);
    mongoose.model("Gateway", gatewaySchema);
}