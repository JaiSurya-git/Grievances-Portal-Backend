const errorHandler = require("./middleware/errorHandler");

const express = require("express");

const corsMiddleware = require("./config/cors");

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Grievance Portal Backend is running!");
});

// Central error handler — keep this after routes
app.use(errorHandler);

module.exports = app;