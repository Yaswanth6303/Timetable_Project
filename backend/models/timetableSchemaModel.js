// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the Timetable model
const timetableSchema = new Schema({
    day: { // Day of the week (e.g., "Monday", "Tuesday")
        type: String, 
        required: true // This field is mandatory
    },
    timeSlot: { // Time slot for the class (e.g., "9:00 AM - 10:00 AM")
        type: String,
        required: true // This field is mandatory
    },
    facultyId: { // ID of the faculty member teaching the course
        type: Schema.Types.ObjectId, 
        ref: "Faculty", // Refers to the Faculty model
        required: true // This field is mandatory
    },
    courseCode: { // ID of the course being taught
        type: Schema.Types.ObjectId, 
        ref: "Course", // Refers to the Course model
        required: true // This field is mandatory
    },
    roomNumber: { // Room number where the class is held
        type: String,
        required: true // This field is mandatory
    },
    blockNumber: { // Block number where the room is located
        type: String,
        required: true // This field is mandatory
    },
    daySort: { // Numerical representation of the day for sorting (e.g., 1 for Monday, 2 for Tuesday)
        type: Number 
    },
    hourSort: { // Numerical representation of the hour for sorting (e.g., 9 for 9:00 AM)
        type: Number 
    }
});

// Create the Timetable model from the schema
const timetableSchemaModel = mongoose.model("Timetable", timetableSchema);

// Export the Timetable model to be used in other parts of the application
module.exports = {
    timetableSchemaModel 
}
