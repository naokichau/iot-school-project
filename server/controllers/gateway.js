const mongoose = require("mongoose");

const Gateway = mongoose.model("Gateway");
const User = mongoose.model("User");

const registerGateway = (user, data) => {
    return new Promise((resolve, reject) => {
        const {
            id
        } = user;

        const gateway = new Gateway(data);
        gateway.ownerId = await (User.findOne({
            id
        }));
        const query = await (gateway.save());
        return query;
    })
}

const updateGateway = (gateway, data) => {
    // const {
    //     name,
    // } = data;
    // const currentUser = user;

    // currentUser.name = name;
    return gateway.save();
};

const deleteGateway = (gateway) => gateway.remove();

const findGatewayByOwnerID = (ownerID) => Gateway.find({
    ownerId: ownerID
});

const findGateway = (id) => Gateway.findOne({
    _id: id
});

module.exports = {
    registerGateway,
    updateGateway,
    deleteGateway,
    findGatewayByOwnerID,
    findGateway,
};