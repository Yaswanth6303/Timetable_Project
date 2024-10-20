const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const facultySchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const facultyModel = mongoose.model('Faculty', facultySchema);

module.exports = {
    facultyModel
}