const mongoose = require('mongoose');
const Grievance = require('../../models/Grievance');

const { appendHistoryEntry } = require('../../services/historyService');
const { isValidTransition } = require('../../services/statusService');
const { GRIEVANCE_STATUSES, GRIEVANCE_CATEGORIES } = require('../../utils/constants');

// Helper: find grievance using either MongoDB ID or grievance ID
const findGrievance = async (id) => {
    const conditions = [{ grievanceId: id }];

    if (mongoose.Types.ObjectId.isValid(id)) {
        conditions.push({ _id: id });
    }

    return Grievance.findOne({ $or: conditions });
};


// 1. Get all grievances with optional filters
const getAllGrievances = async (req, res, next) => {
    try {
        const { status, category, search } = req.query;

        const filter = {};

        if (status) {
            if (!GRIEVANCE_STATUSES.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid grievance status'
                });
            }

            filter.status = status;
        }

        if (category) {
            if (!GRIEVANCE_CATEGORIES.includes(category)) {
                return res.status(400).json({
                    message: 'Invalid grievance category'
                });
            }

            filter.category = category;
        }

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            filter.$or = [
                { grievanceId: { $regex: escapedSearch, $options: 'i' } },
                { title: { $regex: escapedSearch, $options: 'i' } },
                { description: { $regex: escapedSearch, $options: 'i' } }
            ];
        }

        const grievances = await Grievance.find(filter)
            .populate('studentId', 'name rollNo email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: grievances.length,
            grievances
        });

    } catch (error) {
        next(error);
    }
};


// 2. Get one grievance
const getOneGrievance = async (req, res, next) => {
    try {
        const grievance = await findGrievance(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        await grievance.populate('studentId', 'name rollNo email');

        res.status(200).json({ grievance });

    } catch (error) {
        next(error);
    }
};


// 3. Add a remark
const addRemark = async (req, res, next) => {
    try {
        const { remark } = req.body;

        if (typeof remark !== 'string' || !remark.trim()) {
            return res.status(400).json({
                message: 'Remark is required'
            });
        }

        const grievance = await findGrievance(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        appendHistoryEntry(
            grievance,
            'Admin added a remark',
            req.user.id,
            'admin',
            grievance.status,
            remark.trim()
        );

        await grievance.save();

        res.status(200).json({
            message: 'Remark added successfully',
            grievance
        });

    } catch (error) {
        next(error);
    }
};


// 4. Update grievance status
const updateStatus = async (req, res, next) => {
    try {
        const { status, remark } = req.body;

        if (!GRIEVANCE_STATUSES.includes(status)) {
            return res.status(400).json({
                message: 'Invalid grievance status',
                allowedStatuses: GRIEVANCE_STATUSES
            });
        }

        if (remark !== undefined &&
            (typeof remark !== 'string' || !remark.trim())) {
            return res.status(400).json({
                message: 'Remark must be a non-empty string'
            });
        }

        const grievance = await findGrievance(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        if (!isValidTransition(grievance.status, status)) {
            return res.status(400).json({
                message: `Status transition from ${grievance.status} to ${status} is not allowed`
            });
        }

        const previousStatus = grievance.status;

        grievance.status = status;

        appendHistoryEntry(
            grievance,
            `Status changed from ${previousStatus} to ${status}`,
            req.user.id,
            'admin',
            status,
            remark ? remark.trim() : ''
        );

        await grievance.save();

        res.status(200).json({
            message: 'Grievance status updated successfully',
            grievance
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllGrievances,
    getOneGrievance,
    addRemark,
    updateStatus
};