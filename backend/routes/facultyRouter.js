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

// Define a route for faculty to update the profile
facultyRouter.put("/updateMyProfile", facultyMiddleware, facultyController.updateMyProfile);

// Define a route for faculty to change password
facultyRouter.put("/change-password", facultyMiddleware, facultyController.changePassword);

// Define the route for faculty to view the master timetable (protected by middleware)
facultyRouter.get('/masterTimetable', facultyMiddleware, facultyController.viewMasterTimetable);

// Define a route for faculty to view the courses they are assigned to (protected by middleware)
facultyRouter.get("/courses", facultyMiddleware, facultyController.viewAssignedCourses);

// Export the faculty router
module.exports = {
    facultyRouter
};
