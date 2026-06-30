const { body } = require("express-validator");

exports.notificationValidation = [
    body("title").notEmpty().withMessage("Title is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("priority").notEmpty().withMessage("Priority is required")
];
