const express = require("express");
const app = express();

const corsMiddleware = require("./config/cors");

const errorHandler = require("./middleware/errorHandler");

const studentAuthRoutes = require('./routes/student/studentAuthRoutes');
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes');
const studentGrievanceRoutes =
    require('./routes/student/studentGrievanceRoutes');

const adminGrievanceRoutes =
    require('./routes/admin/adminGrievanceRoutes');
const dashboardRoutes =
    require('./routes/admin/dashboardRoutes');

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth/students', studentAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);

app.use('/api/grievances', studentGrievanceRoutes);

app.use('/api/admin/grievances', adminGrievanceRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

app.get('/test', (req, res) => {
    res.send('App is working');
});

app.get("/", (req, res) => {
    res.send("Grievance Portal Backend is running!");
});

app.use(errorHandler);

module.exports = app;