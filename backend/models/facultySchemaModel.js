const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const facultySchema = new Schema({
    facultyId: {
        type: String,
        required: true,
        unique: true
    },
    facultyName: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    }
});

const facultySchemaModel = mongoose.model("Faculty", facultySchema);

module.exports = {
    facultySchemaModel
}