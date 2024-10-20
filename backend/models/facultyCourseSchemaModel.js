const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const facultyCourseSchema = new Schema({
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    courseCode: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    graduationLevel: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    facultyName: {
        type: String,
        required: true
    }
});

const facultyCourseSchemaModel = mongoose.model("FacultyCourse", facultyCourseSchema);

module.exports = {
    facultyCourseSchemaModel
}