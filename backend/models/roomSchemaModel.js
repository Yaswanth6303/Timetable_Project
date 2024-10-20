// Import the mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Get the Schema class from mongoose to define the structure of our data
const Schema = mongoose.Schema;
// Get the ObjectId class from mongoose to work with object IDs
const ObjectId = mongoose.Types.ObjectId;

// Define the schema for the Room model
const roomSchema = new Schema({
    roomNumber: {
        type: String, // Room number is a string
        required: true // Room number is required
    },
    blockNumber: {
        type: String, // Block number is a string
        required: true // Block number is required
    },
    roomType: {
        type: String // Room type is a string
    },
    capacity: {
        type: Number // Room capacity is a number
    }
});

// Create the Room model from the roomSchema
const roomSchemaModel = mongoose.model("Room", roomSchema);

// Export the Room model to be used in other parts of the application
module.exports = {
    roomSchemaModel
}
