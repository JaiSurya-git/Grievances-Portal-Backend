const errorHandler = require("./middleware/errorHandler");
const studentAuthRoutes = require('./routes/student/studentAuthRoutes');
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes');

const express = require("express");

const corsMiddleware = require("./config/cors");

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth/students', studentAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);

app.get("/", (req, res) => {
    res.send("Grievance Portal Backend is running!");
});

// Central error handler — keep this after routes
app.use(errorHandler);

module.exports = app;