// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the student model
const studentSchema = new Schema({
    firstName: {
        type: String, // firstName is a string
        required: true // firstName is required
    },
    lastName: {
        type: String, // lastName is a string
        required: true // lastName is required
    },
    email: {
        type: String, // Email is a string
        required: true, // Email is required
        unique: true // Email must be unique
    },
    password: {
        type: String, // Password is a string
        required: true // Password is required
    },
    studentId: { // Student ID field
        type: String, // Data type is String
        required: true, // This field is required
        unique: true // This field must be unique
    },
    school: { // School field
        type: String, // Data type is String
        required: true // This field is required
    },
    program: { // Program field
        type: String, // Data type is String
        required: true // This field is required
    },
    batch: { // Batch field
        type: Number, // Data type is Number (e.g. 2022)
        required: true // This field is required
    },
    graduationLevel: { // Graduation level field
        type: String, // Data type is String
        required: true // This field is required
    }
});

// Create the Faculty model from the studentSchema
const studentModel = mongoose.model('Student', studentSchema);

// Export the studentModel to be used in other parts of the application
module.exports = {
    studentModel
};
