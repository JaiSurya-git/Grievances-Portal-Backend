const Grievance = require('../models/Grievance');

const generateGrievanceId = async () => {
    const year = new Date().getFullYear();
    const count = await Grievance.countDocuments({
        grievanceId: new RegExp(`^GRV-${year}-`)
    });

    return `GRV-${year}-${String(count + 1).padStart(3, '0')}`;
};

module.exports = { generateGrievanceId };