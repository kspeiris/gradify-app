const { body } = require("express-validator");

exports.registerValidation = [

    body("firstName")
        .notEmpty(),

    body("lastName")
        .notEmpty(),

    body("email")
        .isEmail(),

    body("password")
        .isLength({ min: 6 })
];
