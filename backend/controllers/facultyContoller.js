// Import necessary modules
const zod = require("zod"); // For schema validation
const bcrypt = require("bcrypt"); // For password hashing
const { facultyModel } = require("../models/facultyModel"); // Faculty model
const jwt = require("jsonwebtoken"); // For JWT authentication
const JWT_FACULTY_PASSWORD = process.env.JWT_FACULTY_PASSWORD // Secret key for JWT
const { timetableSchemaModel } = require("../models/timetableSchemaModel"); // Timetable model
const { roomSchemaModel } = require("../models/roomSchemaModel"); // Room model
const masterTimetableModel = require("../models/masterTimetableModel"); // Master Timetable Model
const { facultyCourseSchemaModel } = require("../models/facultyCourseSchemaModel"); // FacultyCourse Model

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
    password: zod.string().min(4).max(20), // Password must be between 4 and 20 characters.
  });

  // Parse and validate the request body against the schema.
  const parsedPayload = requiredPayload.safeParse(req.body);

  // If validation fails, return a 411 status with an error message.
  if (!parsedPayload.success) {
    return res.status(400).json({
      msg: "Improper Credentials",
    });
  }

  try {
    // Find the user in the database based on the provided email.
    const foundUser = await facultyModel.findOne({
      email: parsedPayload.data.email,
    });

    // If the user is not found, return a 404 status with an error message.
    if (!foundUser) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    // Compare the provided password with the stored hashed password.
    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.password,
      foundUser.password
    );

    // If the passwords match, generate a JWT and send it in the response.
    if (passwordMatch) {
      if (!JWT_FACULTY_PASSWORD) {
        return res.status(500).json({
          msg: "JWT Secret not defined",
        });
      }

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

/**
 * Updates the profile of a faculty member.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
async function updateMyProfile(req, res) {
  // Get the faculty ID from the request object.
  const facultyId = req.facultyId;

  // Define the required payload schema using Zod.
  const requiredPayload = zod.object({
    firstName: zod.string().min(3).max(20).optional(),
    lastName: zod.string().min(3).max(20).optional(),
  });

  // Parse and validate the request body against the schema.
  const parsedPayload = requiredPayload.safeParse(req.body);

  // If validation fails, return a 411 status with an error message.
  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "Improper Credentials",
    });
  }

  // Find the faculty member in the database using the faculty ID.
  const foundFaculty = await facultyModel.findOne({ _id: facultyId });

  // If the faculty member is not found, return a 404 status with an error message.
  if (!foundFaculty) {
    return res.status(404).json({
      msg: "Faculty not found",
    });
  }

  // Update the faculty member's first and last names if provided in the request body.
  foundFaculty.firstName =
    parsedPayload.data.firstName || foundFaculty.firstName;
  foundFaculty.lastName = parsedPayload.data.lastName || foundFaculty.lastName;

  // Try to save the updated faculty member to the database.
  try {
    await foundFaculty.save();
    // If the save is successful, return a 200 status with a success message.
    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    // If there is an error during the save, return a 500 status with an error message.
    return res.status(500).json({
      msg: "Error updating profile",
      error: error.message,
    });
  }
}

/**
 * Function to handle faculty password change requests.
 * @param {Object} req - The request object containing facultyId and new password details.
 * @param {Object} res - The response object used to send the response back to the client.
 */
async function changePassword(req, res) {
  // Get the faculty ID from the request object
  const facultyId = req.facultyId;

  // Define a schema for validating the password change payload using Zod
  const passwordSchema = zod.object({
    oldPassword: zod.string().min(4).max(20), // Old password must be between 4 and 20 characters
    newPassword: zod.string().min(4).max(20), // New password must be between 4 and 20 characters
  });

  // Parse and validate the request body against the schema
  const parsedPayload = passwordSchema.safeParse(req.body);

  // If validation fails, return an error response
  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "Improper Credentials", // Indicate that the provided credentials are invalid
    });
  }

  try {
    // Find the faculty record in the database using the faculty ID
    const foundFaculty = await facultyModel.findOne({ _id: facultyId });

    // If faculty record is not found, return an error response
    if (!foundFaculty) {
      return res.status(404).json({
        msg: "Faculty not found", // Indicate that the faculty was not found
      });
    }

    // Compare the provided old password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.oldPassword,
      foundFaculty.password
    );

    // If passwords do not match, return an error response
    if (!passwordMatch) {
      return res.status(401).json({
        msg: "Old password is incorrect", // Indicate that the old password is incorrect
      });
    }

    // Hash the new password using bcrypt
    const hashedNewPassword = await bcrypt.hash(
      parsedPayload.data.newPassword,
      10
    );

    // Update the faculty record with the new hashed password
    await facultyModel.updateOne(
      { _id: facultyId },
      { password: hashedNewPassword }
    );

    // Return a success response
    return res.status(200).json({
      msg: "Password changed successfully", // Indicate that the password was changed successfully
    });
  } catch (error) {
    // If any error occurs during the process, return an error response
    return res.status(500).json({
      msg: "Error changing password", // Indicate that there was an error changing the password
      error: error.message, // Provide the error message for debugging
    });
  }
}

/**
 * Retrieves the master timetable.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The master timetable data or an error message.
 */
async function viewMasterTimetable(req, res) {
  try {
    // Find all documents in the masterTimetableModel collection
    const masterTimetable = await masterTimetableModel.find({});

    // If no master timetable is found, return a 404 error
    if (!masterTimetable) {
      return res.status(404).json({
        msg: "Master timetable not found",
      });
    }

    // If master timetable is found, return a 200 success response with the data
    return res.status(200).json({
      message: "Master timetable retrieved successfully",
      data: masterTimetable,
    });
  } catch (error) {
    // If an error occurs during the process, return a 500 error
    return res.status(500).json({
      msg: "Error retrieving master timetable",
      error: error.message,
    });
  }
}

/**
 * Retrieves and returns the courses assigned to a specific faculty member.
 *
 * @param {Object} req - The request object containing the faculty member's ID.
 * @param {Object} res - The response object used to send the response.
 */
async function viewAssignedCourses(req, res) {
  try {
    // Extract the faculty ID from the request object
    const facultyId = req.facultyId;

    // Find courses assigned to the faculty member using the facultyCourseSchemaModel
    // and populate the 'courseCode' field with course code and title.
    const assignedCourses = await facultyCourseSchemaModel
      .find({ facultyId })
      .populate("courseCode", "courseCode courseTitle")
      .exec();

    // If no assigned courses are found, return a 404 response
    if (!assignedCourses || assignedCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses assigned to this faculty member.",
      });
    }

    // If assigned courses are found, return a 200 response with the courses
    res.status(200).json({
      success: true,
      courses: assignedCourses,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching assigned courses:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching assigned courses.",
      error: error.message,
    });
  }
}

// Export the function to make it accessible from other modules.
module.exports = {
  facultySignup,
  facultySignin,
  viewOwnTimetable,
  updateMyProfile,
  changePassword,
  viewMasterTimetable,
  viewAssignedCourses,
};
