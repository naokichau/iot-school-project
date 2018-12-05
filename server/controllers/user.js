const mongoose = require("mongoose");

const User = mongoose.model("User");

const saveUser = (data) => {
    const user = new User(data);
    return user.save();
};

const editUser = (userObj, data) => {
    const {
        name,
    } = data;
    const currentUser = userObj;

    currentUser.name = name;
    return userObj.save();
};

const deleteUser = (userObj) => userObj.remove();

const findUserById = (id) => User.findOne({
    _id: id
});

const findUserByPk = (pkey) => User.findOne({
    pubkey: pkey
});


module.exports = {
    saveUser,
    editUser,
    deleteUser,
    findUserById,
    findUserByPk
};