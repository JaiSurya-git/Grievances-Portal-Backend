require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function testInsert() {
  try {
    // Connect to the DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for verification...");

    // Wipe any older tests
    await Student.deleteMany({});

    // Create a dummy record using Phase 2 requirements
    const sampleStudent = await Student.create({
      name: "Alex Mercer",
      rollNo: "CS2026099",
      email: "alex@college.edu",
      password: "securepassword123"
    });

    console.log("🚀 Success! Data saved in Atlas:", sampleStudent);
  } catch (error) {
    console.error("❌ Test insert failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed cleanly.");
  }
}

testInsert();
