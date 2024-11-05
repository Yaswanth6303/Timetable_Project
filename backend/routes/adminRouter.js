const express = require("express");
const multer = require("multer");
const {
  adminSignup,
  adminSignin,
  addManualTimetableEntry,
  updateMasterTimetableFromExcel,
  addFaculty,
  addCourse,
  addRoom, 
} = require("../controllers/adminController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

const adminRouter = express.Router();

// Multer configuration for handling Excel file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx files are allowed"));
    }
  },
});

// Admin authentication routes
adminRouter.post("/signup", adminSignup);
adminRouter.post("/signin", adminSignin);

// Admin routes for managing the master timetable
adminRouter.post("/master-timetable/manual", adminMiddleware, addManualTimetableEntry); // Add manual entry
adminRouter.post("/master-timetable/upload", adminMiddleware, upload.single("file"), updateMasterTimetableFromExcel); // Upload Excel file

adminRouter.post("/addFaculty", adminMiddleware, addFaculty);
adminRouter.post("/addCourse", adminMiddleware, addCourse);
adminRouter.post("/addRoom", adminMiddleware, addRoom)

module.exports = {
  adminRouter,
};
