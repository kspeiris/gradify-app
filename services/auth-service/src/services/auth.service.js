const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {

    const existingUser =
        await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword =
        await bcrypt.hash(data.password, 10);

    const role =
        await prisma.role.findUnique({
            where: {
                name: "STUDENT"
            }
        });

    const user =
        await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword,
                roleId: role.id
            }
        });

    return user;
};

exports.login = async (email, password) => {

    const user =
        await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

    if (!user)
        throw new Error("User not found");

    const match =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!match)
        throw new Error("Invalid password");

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user
    };
};
