const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { adminModel } = require("../models/adminModel");
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const XLSX = require("xlsx");
const masterTimetableModel = require("../models/masterTimetableModel");
const { facultySchemaModel } = require("../models/facultySchemaModel");
const { courseSchemaModel } = require("../models/courseSchemaModel");
const { roomSchemaModel } = require("../models/roomSchemaModel");

// Admin Signup
async function adminSignup(req, res) {
  const requiredPayload = zod.object({
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
  });

  const parsedPayload = requiredPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    return res.status(400).json({
      msg: "Improper Credentials",
      errors: parsedPayload.error.errors,
    });
  }

  const foundUser = await adminModel.findOne({
    email: parsedPayload.data.email,
  });
  if (foundUser) {
    return res.status(409).json({ msg: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(parsedPayload.data.password, 10);

  try {
    const newAdmin = await adminModel.create({
      firstName: parsedPayload.data.firstName,
      lastName: parsedPayload.data.lastName,
      email: parsedPayload.data.email,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Admin created successfully",
      user: newAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

// Admin Signin
async function adminSignin(req, res) {
  const requiredPayload = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
  });

  const parsedPayload = requiredPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    return res.status(400).json({
      msg: "Improper Credentials",
      errors: parsedPayload.error.errors,
    });
  }

  try {
    const foundUser = await adminModel.findOne({
      email: parsedPayload.data.email,
    });

    if (!foundUser) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.password,
      foundUser.password
    );

    if (passwordMatch) {
      if (!JWT_ADMIN_PASSWORD) {
        return res.status(500).json({ msg: "JWT Secret not defined" });
      }

      const token = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        JWT_ADMIN_PASSWORD
      );

      return res.status(200).json({
        msg: "Admin signed in successfully",
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

async function addFaculty(req, res) {
  const facultySchema = zod.object({
    facultyId: zod.string().min(1, "Faculty ID is required"),
    facultyName: zod.string().min(1, "Faculty name is required"),
    school: zod.string().min(1, "School is required"),
  });

  const parsedData = facultySchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Validation Error",
      errors: parsedData.error.errors,
    });
  }

  try {
    const newFaculty = await facultySchemaModel.create(parsedData.data);
    return res.status(201).json({
      msg: "Faculty added successfully",
      faculty: newFaculty,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error adding faculty",
      error: error.message,
    });
  }
}

async function addCourse(req, res) {
  const courseSchema = zod.object({
    courseCode: zod.string().min(1, "Course code is required"),
    courseTitle: zod.string().min(1, "Course title is required"),
    basket: zod.string(),
    credits: zod.number().positive("Credits must be a positive number"),
  });

  const parsedData = courseSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Validation Error",
      errors: parsedData.error.errors,
    });
  }

  try {
    const newCourse = await courseSchemaModel.create(parsedData.data);
    return res.status(201).json({
      msg: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error adding course",
      error: error.message,
    });
  }
}

async function addRoom(req, res) {
  try {
    const requiredPayload = zod.object({
      roomNumber: zod.string(),
      block: zod.string(),
      roomType: zod.string(),
      capacity: zod.number().positive("Capacity must be a positive number"),
    });

    const parsedPayload = requiredPayload.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(400).json({
        msg: "Validation Error",
        errors: parsedPayload.error.errors,
      });
    }

    const { roomNumber, block, roomType, capacity } = parsedPayload.data;

    const newRoom = new roomSchemaModel({
      roomNumber,
      block,
      roomType,
      capacity,
    });

    const savedRoom = await newRoom.save();

    return res.status(201).json({
      message: "Room added successfully",
      room: savedRoom,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding room",
      error: error.message,
    });
  }
}

async function updateMasterTimetableFromExcel(req, res) {
  try {
    const fileBuffer = req.file.buffer;
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const timetableEntries = XLSX.utils.sheet_to_json(sheet);

    const bulkOps = timetableEntries.map((entry) => {
      return {
        updateOne: {
          filter: {
            day: entry.day,
            timeSlot: entry.timeSlot,
            batch: entry.batch,
            courseCode: entry.courseCode,
          },
          update: {
            day: entry.day,
            timeSlot: entry.timeSlot,
            batch: entry.batch,
            graduationLevel: entry.graduationLevel,
            school: entry.school,
            program: entry.program,
            semester: entry.semester,
            courseCode: entry.courseCode,
            courseTitle: entry.courseTitle,
            block: entry.block,
            roomNumber: entry.roomNumber,
            roomType: entry.roomType,
          },
          upsert: true,
        },
      };
    });

    await masterTimetableModel.bulkWrite(bulkOps);
    res
      .status(200)
      .json({ msg: "Master timetable updated successfully from Excel file" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error processing Excel file", error: error.message });
  }
}

async function addManualTimetableEntry(req, res) {
  try {
    const timetableEntrySchema = zod.object({
      day: zod.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]),
      timeSlot: zod.string().min(1, "Time slot is required"),
      batch: zod.string().min(1, "Batch is required"),
      graduationLevel: zod.enum(["UG", "PG"], {
        required_error: "Graduation level is required",
      }),
      school: zod.string().min(1, "School is required"),
      program: zod.string().min(1, "Program is required"),
      semester: zod.string().min(1, "Semester is required"),
      courseTitle: zod.string().min(1, "Course Title is required"),
      courseCode: zod.string().min(1, "Course Code is requires"),
      faculty: zod.string().min(1, "Faculty is required"),
      room: zod.string().min(1, "Room is required"),
      block: zod.string().min(1, "Block is required"),
    });

    const parsedData = timetableEntrySchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        msg: "Validation Error",
        errors: parsedData.error.errors,
      });
    }

    const newEntry = new masterTimetableModel({
      day: parsedData.data.day,
      timeSlot: parsedData.data.timeSlot,
      batch: parsedData.data.batch,
      graduationLevel: parsedData.data.graduationLevel,
      school: parsedData.data.school,
      program: parsedData.data.program,
      semester: parsedData.data.semester,
      courseTitle: new mongoose.Types.ObjectId(parsedData.data.courseTitle),
      courseCode: new mongoose.Types.ObjectId(parsedData.data.courseCode),
      faculty: new mongoose.Types.ObjectId(parsedData.data.faculty),
      room: new mongoose.Types.ObjectId(parsedData.data.room),
      block: parsedData.data.block,
    });

    await newEntry.save();

    res
      .status(201)
      .json({ msg: "New timetable entry added successfully", entry: newEntry });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error adding timetable entry", error: error.message });
  }
}

module.exports = {
  adminSignup,
  adminSignin,
  addFaculty,
  addCourse,
  addRoom,
  updateMasterTimetableFromExcel,
  addManualTimetableEntry,
};
