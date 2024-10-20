const zod = require("zod");
const bcrypt = require("bcrypt");
const { facultyModel } = require("../models/facultyModel");
const jwt = require("jsonwebtoken");
const JWT_FACULTY_PASSWORD = require("../config/config");
const { timetableSchemaModel } = require("../models/timetableModel");
const { roomSchemaModel } = require("../models/roomModel");

async function facultySignup(req, res) {
  const requiredPayload = zod.object({
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
  });

  const parsedPayload = requiredPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "Improper Credentials",
    });
  }

  const foundUser = await facultyModel.findOne({
    $or: [{ email: parsedPayload.data.email }],
  });

  if (foundUser) {
    return res.status(409).json({
      msg: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(parsedPayload.data.password, 10);

  try {
    const newFaculty = await facultyModel.create({
      firstName: parsedPayload.data.firstName,
      lastName: parsedPayload.data.lastName,
      email: parsedPayload.data.email,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Faculty created successfully",
      user: newFaculty,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        msg: "Faculty already exists",
      });
    }
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
}

async function facultySignin(req, res) {
  const requiredPayload = zod.object({
    email: zod.string().email(), 
    password: zod.string().min(4).max(20)
  });

  const parsedPayload = requiredPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "Improper Credentials",
    });
  }

  try {
    const foundUser = await facultyModel.findOne({
      $or: [{ email: parsedPayload.data.email }],
    });

    if (!foundUser) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.password,
      foundUser.password
    );

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
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

async function viewOwnTimetable(req, res) {
  try {
    // Extract facultyId from the middleware
    const facultyId = req.facultyId;

    // Find all timetable entries for this faculty member
    const facultyTimetable = await timetableSchemaModel
      .find({ facultyId })
      .populate("courseCode", "courseCode courseTitle") // Populate course data
      .populate("facultyId", "facultyName") // Populate faculty data
      .lean();

    // Find room details for each timetable entry
    const formattedTimetable = await Promise.all(
      facultyTimetable.map(async (entry) => {
        const roomDetails = await roomSchemaModel
          .findOne({
            roomNumber: entry.roomNumber,
            blockNumber: entry.blockNumber,
          })
          .lean();

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
          roomType: roomDetails?.roomType || "Not specified",
        };
      })
    );

    // Send the formatted timetable as the response
    return res.status(200).json({
      timetable: formattedTimetable,
    });
  } catch (error) {
    // Handle any errors during retrieval
    return res.status(500).json({
      msg: "Error retrieving timetable",
      error: error.message,
    });
  }
}


module.exports = {
  facultySignup,
  facultySignin,
  viewOwnTimetable
};
