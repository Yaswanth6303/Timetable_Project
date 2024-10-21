const mongoose = require("mongoose") // Import Mongoose for MongoDB interaction

// Define an asynchronous function to connect to MongoDB
async function connectDB(){
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL) // Connect to MongoDB using the provided URL
        console.log('Connected to MongoDB database: ' + connect.connection.host); // Log a success message
    }catch(err){
        console.log(err) // Log any errors that occur during connection
    }
}

// Export the connectDB
module.exports = connectDB