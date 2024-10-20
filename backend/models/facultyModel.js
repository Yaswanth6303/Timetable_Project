// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the Faculty model
const facultySchema = new Schema({
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
    }
});

// Create the Faculty model from the facultySchema
const facultyModel = mongoose.model('Faculty', facultySchema);

// Export the facultyModel to be used in other parts of the application
module.exports = {
    facultyModel
};
