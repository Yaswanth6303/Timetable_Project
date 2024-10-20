const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    basket: {
        type: String
    },
    credits: {
        type: Number,
        required: true
    }
});

const courseSchemaModel = mongoose.model('Course', courseSchema);

module.exports = {
    courseSchemaModel
}