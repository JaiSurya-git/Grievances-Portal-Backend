const allowedTransitions = {
    "Submitted": ["Under Review", "Rejected"],

    "Under Review": ["In Progress", "Resolved", "Rejected"],

    "In Progress": ["Resolved", "Rejected"],

    "Resolved": [],

    "Rejected": []
};

const isValidTransition = (currentStatus, newStatus) => {
    const allowedStatuses = allowedTransitions[currentStatus];

    if (!allowedStatuses) {
        return false;
    }

    return allowedStatuses.includes(newStatus);
};

module.exports = {
    isValidTransition
};