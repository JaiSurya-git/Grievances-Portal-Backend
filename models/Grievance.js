
const mongoose = require('mongoose');
const {
    GRIEVANCE_STATUSES,
    GRIEVANCE_CATEGORIES
} = require('../utils/constants');

const actionHistorySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updatedByRole: {
        type: String,
        enum: ['student', 'admin'],
        required: true
    },
    status: {
        type: String,
        enum: GRIEVANCE_STATUSES,
        required: true
    },
    remark: {
        type: String,
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const attachmentSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const grievanceSchema = new mongoose.Schema({
    grievanceId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: GRIEVANCE_CATEGORIES
    },
    concernedPerson: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: GRIEVANCE_STATUSES,
        default: 'Submitted'
    },
    attachments: [attachmentSchema],
    actionHistory: [actionHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
