// Import necessary modules
require('dotenv').config() // Load environment variables from .env file
const express = require('express'); // Import Express.js framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const PORT = process.env.PORT || 5000; // Define the port for the server
const MONGO_URL = process.env.MONGO_URL // Get MongoDB connection URL from environment variables
const { facultyRouter } = require("./routes/facultyRouter") // Import the faculty router

// Create an Express application instance
const app = express();
app.use(express.json()); // Enable parsing of JSON request bodies
app.use("/api/v1/faculty", facultyRouter) // Mount the faculty router at the specified path

// Define an asynchronous function to connect to MongoDB
async function main(){
    try{
        await mongoose.connect(MONGO_URL) // Connect to MongoDB using the provided URL
        console.log("Connected to MongoDB") // Log a success message
    }catch(err){
        console.log(err) // Log any errors that occur during connection
    }
}

// Call the main function to establish the MongoDB connection
main()

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log a message indicating the server is running
});
