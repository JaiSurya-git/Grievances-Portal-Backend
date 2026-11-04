const Grievance = require('../../models/Grievance');
const { GRIEVANCE_STATUSES } = require('../../utils/constants');

const getDashboardStats = async (req, res, next) => {
    try {
        const statusCounts = await Grievance.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const counts = {};

        GRIEVANCE_STATUSES.forEach(status => {
            counts[status] = 0;
        });

        statusCounts.forEach(item => {
            counts[item._id] = item.count;
        });

        const totalGrievances = Object.values(counts)
            .reduce((total, count) => total + count, 0);

        res.status(200).json({
            message: 'Dashboard statistics fetched successfully',
            totalGrievances,
            statusCounts: counts
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};