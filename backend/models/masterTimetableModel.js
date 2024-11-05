// Import the mongoose library for MongoDB interaction
const mongoose = require("mongoose");
// Get the Schema class from mongoose
const { Schema } = mongoose;

// Define the schema for the MasterTimetable model
const masterTimetableSchema = new Schema({
  day: {
    type: String, // Day of the week (e.g., Monday, Tuesday)
    required: true, // Day is a required field
  },
  timeSlot: {
    type: String, // Time slot for the class (e.g., 9:00 AM - 10:00 AM)
    required: true, // Time slot is a required field
  },
  courseTitle: {
    type: Schema.Types.ObjectId, // Reference to the Course model
    ref: "Course", // Name of the Course model to reference
    required: true, // Course is a required field
  },
  courseCode: {
    type: Schema.Types.ObjectId, // Reference to the Course model
    ref: "Course", // Name of the Course model to reference
    required: true, // Course is a required field
  },
  faculty: {
    type: Schema.Types.ObjectId, // Reference to the Faculty model
    ref: "Faculty", // Name of the Faculty model to reference
    required: true, // Faculty is a required field
  },
  room: {
    type: Schema.Types.ObjectId, // Reference to the Room model
    ref: "Room", // Name of the Room model to reference
    required: true, // Room is a required field
  },
  block: {
    type: String, // Block or building where the class is held
    required: true, // Block is a required field
  },
  batch: {
    type: String, // Batch or year of the students (e.g., 2023, 2024)
    required: true, // Batch is a required field
  },
  graduationLevel: {
    type: String, // Graduation level (Undergraduate or Postgraduate)
    enum: ["UG", "PG"], // Allowed values for graduation level
    required: true, // Graduation level is a required field
  },
  program: {
    type: String, // Program or course name (e.g., Computer Science, Engineering)
    required: true, // Program is a required field
  },
  semester: {
    type: String, // Semester or term (e.g., Fall 2023, Spring 2024)
    required: true, // Semester is a required field
  }
});

// Create the MasterTimetable model from the schema
const masterTimetableModel = mongoose.model(
  "MasterTimetable",
  masterTimetableSchema
);

// Export the MasterTimetable model to be used in other parts of the application
module.exports = masterTimetableModel;
