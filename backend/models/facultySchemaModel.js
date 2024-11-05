// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose to define the structure of the data
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose to work with object IDs
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the Faculty model
const facultySchema = new Schema({
    facultyId: { // Faculty ID field
        type: String, // Data type is String
        required: true, // This field is required
        unique: true // This field must be unique
    },
    facultyName: { // Faculty name field
        type: String, // Data type is String
        required: true // This field is required
    },
    school: { // School field
        type: String, // Data type is String
        required: true // This field is required
    }
});

// Create the Faculty model from the facultySchema
const facultySchemaModel = mongoose.model("FacultyDetails", facultySchema);

// Export the Faculty model to be used in other parts of the application
module.exports = {
    facultySchemaModel 
}
