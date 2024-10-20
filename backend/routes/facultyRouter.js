// Import the express module
const express = require("express");
// Create an instance of the express router for faculty routes
const facultyRouter = express.Router();

// Import the faculty controller
const facultyController = require("../controllers/facultyContoller");
// Import the faculty middleware
const { facultyMiddleware } = require("../middlewares/facultyMiddleware");

// Define a route for faculty signup
facultyRouter.post("/signup", facultyController.facultySignup);

// Define a route for faculty signin
facultyRouter.post("/signin", facultyController.facultySignin);

// Define a route for faculty to view their own timetable (protected by middleware)
facultyRouter.get("/mytimetable", facultyMiddleware, facultyController.viewOwnTimetable);

// Export the faculty router
module.exports = {
    facultyRouter
};
