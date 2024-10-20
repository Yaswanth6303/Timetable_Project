// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose to define the structure of our data
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose to work with object IDs
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the Course model
const courseSchema = new Schema({
    courseCode: { // Course code (e.g., "CS101")
        type: String, // Data type is String
        required: true, // This field is required
        unique: true // Course code must be unique
    },
    courseTitle: { // Title of the course (e.g., "Introduction to Computer Science")
        type: String, // Data type is String
        required: true // This field is required
    },
    basket: { // Basket or category the course belongs to (optional)
        type: String // Data type is String
    },
    credits: { // Number of credits the course is worth
        type: Number, // Data type is Number
        required: true // This field is required
    }
});

// Create the Course model from the courseSchema
const courseSchemaModel = mongoose.model('Course', courseSchema);

// Export the Course model so it can be used in other parts of the application
module.exports = {
    courseSchemaModel 
};
