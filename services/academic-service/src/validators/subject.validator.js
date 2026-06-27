const { body } = require("express-validator");

exports.createSubjectValidation = [
    body("code")
        .notEmpty()
        .withMessage("Subject code is required"),

    body("name")
        .notEmpty()
        .withMessage("Subject name is required"),

    body("credits")
        .isInt({ min: 1 })
        .withMessage("Credits must be a positive integer"),

    body("semesterId")
        .isInt()
        .withMessage("A valid semesterId is required"),

    body("status")
        .notEmpty()
        .isIn(["ACTIVE", "COMPLETED", "DROPPED"])
        .withMessage("Status must be ACTIVE, COMPLETED, or DROPPED"),

    body("progress")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Progress must be between 0 and 100"),
];

exports.updateSubjectValidation = [
    body("code")
        .optional()
        .notEmpty()
        .withMessage("Subject code cannot be empty"),

    body("name")
        .optional()
        .notEmpty()
        .withMessage("Subject name cannot be empty"),

    body("credits")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Credits must be a positive integer"),

    body("semesterId")
        .optional()
        .isInt()
        .withMessage("A valid semesterId is required"),

    body("status")
        .optional()
        .isIn(["ACTIVE", "COMPLETED", "DROPPED"])
        .withMessage("Status must be ACTIVE, COMPLETED, or DROPPED"),

    body("progress")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Progress must be between 0 and 100"),
];

exports.validate = (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};
