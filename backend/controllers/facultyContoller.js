// Import necessary modules
const zod = require("zod"); // For schema validation
const bcrypt = require("bcrypt"); // For password hashing
const { facultyModel } = require("../models/facultyModel"); // Faculty model
const jwt = require("jsonwebtoken"); // For JWT authentication
const JWT_FACULTY_PASSWORD = require("../config/config"); // Secret key for JWT
const { timetableSchemaModel } = require("../models/timetableModel"); // Timetable model
const { roomSchemaModel } = require("../models/roomModel"); // Room model

/**
 * Handles faculty signup requests.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function facultySignup(req, res) {
  // Define a schema for validating the request body
  const requiredPayload = zod.object({
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
  });

  // Parse and validate the request body against the schema
  const parsedPayload = requiredPayload.safeParse(req.body);

  // Check if the payload is valid
  if (!parsedPayload.success) {
    // Return a 411 error if the payload is invalid
    return res.status(411).json({
      msg: "Improper Credentials",
    });
  }

  // Check if the user already exists
  const foundUser = await facultyModel.findOne({
    $or: [{ email: parsedPayload.data.email }],
  });

  // If the user already exists, return a 409 error
  if (foundUser) {
    return res.status(409).json({
      msg: "User already exists",
    });
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(parsedPayload.data.password, 10);

  // Try to create a new faculty member
  try {
    const newFaculty = await facultyModel.create({
      firstName: parsedPayload.data.firstName,
      lastName: parsedPayload.data.lastName,
      email: parsedPayload.data.email,
      password: hashedPassword,
    });

    // If the faculty member is created successfully, return a 201 response
    return res.status(201).json({
      msg: "Faculty created successfully",
      user: newFaculty,
    });
  } catch (error) {
    // If there is an error, check if it is a duplicate key error
    if (error.code === 11000) {
      // If it is a duplicate key error, return a 400 error
      return res.status(400).json({
        msg: "Faculty already exists",
      });
    }
  }

  // If there is any other error, return a 500 error
  return res.status(500).json({
    message: "Internal Server Error",
  });
}

/**
 * Handles faculty sign-in requests.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function facultySignin(req, res) {
  // Define the schema for validating the request body using Zod.
  const requiredPayload = zod.object({
    email: zod.string().email(), // Email field must be a valid email string.
    password: zod.string().min(4).max(20) // Password must be between 4 and 20 characters.
  });

  // Parse and validate the request body against the schema.
  const parsedPayload = requiredPayload.safeParse(req.body);

  // If validation fails, return a 411 status with an error message.
  if (!parsedPayload.success) {
    return res.status(411).json({
      msg
: "Improper Credentials",
    });
  }

  try {
    // Find the user in the database based on the provided email.
    const foundUser = await facultyModel.findOne({
      $or: [{ email: parsedPayload.data.email }],
    });

    // If the user is not found, return a 404 status with an error message.
    if (!foundUser) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    // Compare the provided password with the stored hashed password.
    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.password,
      foundUser.password
    );

    // If the passwords match, generate a JWT and send it in the response.
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: foundUser._id,
          email: foundUser.email,
        },
        JWT_FACULTY_PASSWORD
      );

      return res.status(200).json({
        msg: "Faculty signed in successfully",
        token: token,
      });
    } else {
      // If the passwords don't match, return a 401 status with an error message.
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }
  } catch (error) {
    // If any error occurs during the process, return a 500 status with the error message.
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * Retrieves the timetable for a specific faculty member.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
async function viewOwnTimetable(req, res) {
  try {
    // Get the faculty ID from the request object.
    const facultyId = req.facultyId;

    // Find the faculty's timetable entries in the database.
    // Populate the 'courseCode' and 'facultyId' fields with relevant information.
    const facultyTimetable = await timetableSchemaModel
      .find({ facultyId })
      .populate("courseCode", "courseCode courseTitle")
      .populate("facultyId", "facultyName") 
      .lean(); // Convert the Mongoose documents to plain JavaScript objects.

    // Format the timetable data for the response.
    const formattedTimetable = await Promise.all(
      facultyTimetable.map(async (entry) => {
        // Find the room details for the current entry.
        const roomDetails = await roomSchemaModel
          .findOne({
            roomNumber: entry.roomNumber,
            blockNumber: entry.blockNumber,
          })
          .lean(); // Convert the Mongoose document to a plain JavaScript object.

        // Return a formatted object for the current entry.
        return {
          day: entry.day,
          timeSlot: entry.timeSlot,
          batch: entry.batch,
          graduationLevel: entry.graduationLevel,
          school: entry.school,
          program: entry.program,
          semester: entry.semester,
          courseCode: entry.courseCode.courseCode,
          courseTitle: entry.courseCode.courseTitle,
          block: entry.blockNumber,
          roomNumber: entry.roomNumber,
          roomType: roomDetails?.roomType || "Not specified", // Use room type from roomDetails if available, otherwise set to "Not specified".
        };
      })
    );

    // Return the formatted timetable with a 200 status code.
    return res.status(200).json({
      timetable: formattedTimetable,
    });
  } catch (error) {
    // If an error occurs, return a 500 status code with the error message.
    return res.status(500).json({
      msg: "Error retrieving timetable",
      error: error.message,
    });
  }
}

// Export the function to make it accessible from other modules.
module.exports = {
  facultySignup,
  facultySignin,
  viewOwnTimetable
};