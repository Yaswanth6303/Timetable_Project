const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { studentModel } = require("../models/studentModel");
const JWT_STUDENT_PASSWORD = process.env.JWT_STUDENT_PASSWORD;

async function studentSignup(req, res) {
  // Define a schema for validating the request body
  const requiredPayload = zod.object({
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
    studentId: zod.string().min(3),
    school: zod.string().min(2),
    program: zod.string().min(2),
    batch: zod.string(), // Assuming a reasonable range
    graduationLevel: zod.enum(["UG", "PG"]),
  });

  // Parse and validate the request body against the schema
  const parsedPayload = requiredPayload.safeParse(req.body);

  // Check if the payload is valid
  if (!parsedPayload.success) {
    return res.status(400).json({
      msg: "Improper Credentials",
      errors: parsedPayload.error.errors,
    });
  }

  const { email, password, studentId } = parsedPayload.data;

  // Check if the user already exists by email or student ID
  const foundUser = await studentModel.findOne({
    $or: [{ email }, { studentId }],
  });
  if (foundUser) {
    return res.status(409).json({
      msg: "Student already exists with the provided email or student ID",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create new student
    const newStudent = await studentModel.create({
      ...parsedPayload.data,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Student created successfully",
      user: {
        id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        studentId: newStudent.studentId,
        school: newStudent.school,
        program: newStudent.program,
        batch: newStudent.batch,
        graduationLevel: newStudent.graduationLevel,
      },
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

async function studentSignin(req, res) {
  const requiredPayload = zod.object({
    email: zod.string().email(),
    password: zod.string().min(4).max(20),
  });

  const parsedPayload = requiredPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    return res.status(400).json({
      msg: "Improper Credentials",
    });
  }

  try {
    const foundUser = await studentModel.findOne({
      email: parsedPayload.data.email,
    });

    if (!foundUser) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(
      parsedPayload.data.password,
      foundUser.password
    );

    if (passwordMatch) {
      if (!JWT_STUDENT_PASSWORD) {
        return res.status(500).json({
          msg: "JWT Secret not defined",
        });
      }

      const token = jwt.sign(
        {
          id: foundUser._id,
          email: foundUser.email,
        },
        JWT_STUDENT_PASSWORD
      );

      return res.status(200).json({
        msg: "Student signed in successfully",
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

module.exports = {
  studentSignup,
  studentSignin
};
