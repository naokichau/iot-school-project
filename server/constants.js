const mongoEndPoint = process.env.MONGODB_URI || "mongodb://localhost:27017/iotdb";
const port = process.env.PORT || 8080;

module.exports = {
    mongoEndPoint,
    port,
};