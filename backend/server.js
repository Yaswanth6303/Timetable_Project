// Import necessary modules
require('dotenv').config() // Load environment variables from .env file
const express = require('express'); // Import Express.js framework
const PORT = process.env.PORT || 5000; // Define the port for the server
const connectDB = require('./connect/database'); // Import the database connection function
const { facultyRouter } = require("./routes/facultyRouter") // Import the faculty router

// Create an Express application instance
const app = express();
app.use(express.json()); // Enable parsing of JSON request bodies
app.use("/api/v1/faculty", facultyRouter) // Mount the faculty router at the specified path

// Call the connectDB function to establish the MongoDB connection
connectDB()

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log a message indicating the server is running
});
