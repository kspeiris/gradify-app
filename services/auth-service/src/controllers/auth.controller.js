const authService = require("../services/auth.service");
const prisma = require("../config/prisma");

exports.register = async (req, res) => {

    try {

        const user =
            await authService.register(
                req.body
            );

        res.status(201).json({
            message: "User registered",
            user
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const result =
            await authService.login(
                req.body.email,
                req.body.password
            );

        res.json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};

exports.profile = async (req, res) => {

    const user =
        await prisma.user.findUnique({

            where: {
                id: req.user.userId
            },

            include: {
                role: true
            }
        });

    res.json(user);
};

exports.updateProfile = async (req, res) => {

    const user =
        await prisma.user.update({

            where: {
                id: req.user.userId
            },

            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        });

    res.json(user);
};
