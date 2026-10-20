const cors = require("cors");

const corsOptions = {
    origin: [
        process.env.STUDENT_PORTAL_URL,
        process.env.ADMIN_PORTAL_URL
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

module.exports = cors(corsOptions);