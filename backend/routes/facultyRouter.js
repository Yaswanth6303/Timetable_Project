const express = require("express");
const facultyRouter = express.Router();

const facultyController = require("../controllers/facultyContoller");
const { facultyMiddleware } = require("../middlewares/facultyMiddleware");

facultyRouter.post("/signup", facultyController.facultySignup)

facultyRouter.post("/signin", facultyController.facultySignin)

facultyRouter.get("/mytimetable", facultyMiddleware ,facultyController.viewOwnTimetable)

module.exports = {
    facultyRouter
}


