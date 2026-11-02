const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');

const ownGrievanceOnly = async (req, res, next) => {
    try {
        const id = req.params.id;

        const conditions = [{ grievanceId: id }];

        if (mongoose.Types.ObjectId.isValid(id)) {
            conditions.push({ _id: id });
        }

        const grievance = await Grievance.findOne({
            studentId: req.user.id,
            $or: conditions
        });

        if (!grievance) {
            return res.status(404).json({
                message: 'Grievance not found'
            });
        }

        req.grievance = grievance;
        next();

    } catch (error) {
        next(error);
    }
};

module.exports = ownGrievanceOnly;