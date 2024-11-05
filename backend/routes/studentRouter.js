const express = require("express");
const { studentSignup, studentSignin } = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.post("/signin", studentSignin);
studentRouter.post("signup", studentSignup);

module.exports = {
    studentRouter
};
