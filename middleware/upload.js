const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName = crypto.randomUUID();
        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName + extension);
    }
});

// Allowed file types
const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];

const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png'
];

// Validate uploaded files
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
        allowedTypes.includes(extension) &&
        allowedMimeTypes.includes(file.mimetype)
    ) {
        return cb(null, true);
    }

    const error = new Error(
        'Only PDF, JPG, JPEG and PNG files are allowed.'
    );

    error.statusCode = 400;

    return cb(error);
};

// Configure Multer
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: fileFilter
});

module.exports = upload;