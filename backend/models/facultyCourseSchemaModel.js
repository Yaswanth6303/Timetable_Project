// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose to define the schema
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose for object IDs
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the FacultyCourse model
const facultyCourseSchema = new Schema({
    facultyId: { // The ID of the faculty member teaching the course
        type: Schema.Types.ObjectId, // Data type is ObjectId, referencing the Faculty model
        ref: "Faculty", // Refers to the Faculty model
        required: true // This field is required
    },
    courseCode: { // The code of the course being taught
        type: Schema.Types.ObjectId, // Data type is ObjectId, referencing the Course model
        ref: "Course", // Refers to the Course model
        required: true // This field is required
    },
    semester: { // The semester in which the course is being taught
        type: String, // Data type is String
        required: true // This field is required
    },
    batch: { // The batch of students enrolled in the course
        type: String, // Data type is String
        required: true // This field is required
    },
    graduationLevel: { // The graduation level of the course (e.g., Undergraduate, Postgraduate)
        type: String, // Data type is String
        required: true // This field is required
    },
    program: { // The program to which the course belongs (e.g., Computer Science, Engineering)
        type: String, // Data type is String
        required: true // This field is required
    },
    facultyName: { // The name of the faculty member teaching the course
        type: String, // Data type is String
        required: true // This field is required
    }
});

// Create the FacultyCourse model from the schema
const facultyCourseSchemaModel = mongoose.model("FacultyCourse", facultyCourseSchema);

// Export the FacultyCourse model to be used in other parts of the application
module.exports = {
    facultyCourseSchemaModel
};
