const Grievance = require('../../models/Grievance');
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

module.exports = {
    submitGrievance,
    getMyGrievances,
    getOneGrievance
};