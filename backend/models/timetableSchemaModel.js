const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const timetableSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
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
    roomNumber: {
        type: String,
        required: true
    },
    blockNumber: {
        type: String,
        required: true
    },
    daySort: {
        type: Number
    },
    hourSort: {
        type: Number
    }
});

const timetableSchemaModel = mongoose.model("Timetable", timetableSchema);

module.exports = {
    timetableSchemaModel
}