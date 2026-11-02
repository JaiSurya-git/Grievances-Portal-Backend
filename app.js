const express = require("express");
const app = express();

const corsMiddleware = require("./config/cors");

const errorHandler = require("./middleware/errorHandler");

const studentAuthRoutes = require('./routes/student/studentAuthRoutes');
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes');
const studentGrievanceRoutes =
    require('./routes/student/studentGrievanceRoutes');

app.use(corsMiddleware);
app.use(express.json());

// Authentication routes
app.use('/api/auth/students', studentAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);

// Grievance routes
app.use('/api/grievances', studentGrievanceRoutes);

app.get('/test', (req, res) => {
    res.send('App is working');
});

app.get("/", (req, res) => {
    res.send("Grievance Portal Backend is running!");
});

// Error handler must be last
app.use(errorHandler);

module.exports = app;