const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const roomSchema = new Schema({
    roomNumber: {
        type: String,
        required: true
    },
    blockNumber: {
        type: String,
        required: true
    },
    roomType: {
        type: String
    },
    capacity: {
        type: Number
    }
});

const roomSchemaModel = mongoose.model("Room", roomSchema);

module.exports = {
    roomSchemaModel
}