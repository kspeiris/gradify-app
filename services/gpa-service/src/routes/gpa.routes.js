const router = require("express").Router();
const controller = require("../controllers/gpa.controller");
const auth = require("../middleware/auth.middleware");

// Calculate SGPA & CGPA for a semester
router.post("/calculate", auth, controller.calculateGPA);

module.exports = router;
