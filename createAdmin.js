
require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const { hashPassword } = require("./services/passwordService");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("Admin credentials are missing from .env");
        }

        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await hashPassword(password);

        await Admin.create({
            name: "Portal Administrator",
            email: email.toLowerCase(),
            designation: "Administrator",
            password: hashedPassword
        });

        console.log("Admin created successfully");
        console.log("Email:", email);

    } catch (error) {
        console.error(error.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
