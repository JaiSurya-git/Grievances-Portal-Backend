const mongoose = require('mongoose');
const Grievance = require('../../models/Grievance');
const path = require('path');
const fs = require('fs');
const findStudentGrievance = async (id, studentId) => {
    const conditions = [
        { grievanceId: id }
    ];

    if (mongoose.Types.ObjectId.isValid(id)) {
        conditions.push({ _id: id });
    }

    return Grievance.findOne({
        $or: conditions,
        studentId: studentId
    });
};

const { createGrievance } = require('../../services/grievanceService');

// Submit a grievance
const submitGrievance = async (req, res, next) => {
    try {
        const grievance = await createGrievance(
            req.body,
            req.user.id
        );

        res.status(201).json({
            message: 'Grievance submitted successfully',
            grievance
        });

    } catch (error) {
        next(error);
    }
};

// List all grievances belonging to the logged-in student
const getMyGrievances = async (req, res, next) => {
    try {
        const grievances = await Grievance.find({
            studentId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: grievances.length,
            grievances
        });

    } catch (error) {
        next(error);
    }
};

// Get one grievance
const getOneGrievance = async (req, res) => {
    res.status(200).json({
        grievance: req.grievance
    });
};

// Upload an attachment
const uploadAttachment = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Please select a file to upload'
            });
        }

        const grievance = await findStudentGrievance(
             req.params.id,
            req.user.id
        );

        if (!grievance) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        const attachment = {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: path.join('uploads', req.file.filename),
            mimeType: req.file.mimetype,
            size: req.file.size
        };

        grievance.attachments.push(attachment);
        await grievance.save();

        res.status(201).json({
            message: 'Attachment uploaded successfully',
            attachment
        });

    } catch (error) {
        next(error);
    }
};

// Download an attachment
const downloadAttachment = async (req, res, next) => {
    try {
        const grievance = await findStudentGrievance(
          req.params.id,
         req.user.id
        );

        if (!grievance) {
            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        const attachment = grievance.attachments.id(
            req.params.attachmentId
        );

        if (!attachment) {
            return res.status(404).json({
                message: 'Attachment not found'
            });
        }

        const filePath = path.join(
            __dirname,
            '../../uploads',
            attachment.fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: 'Attachment file not found'
            });
        }

        res.download(filePath, attachment.originalName);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitGrievance,
    getMyGrievances,
    getOneGrievance,
    uploadAttachment,
    downloadAttachment
};