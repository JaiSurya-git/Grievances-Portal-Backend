const appendHistoryEntry = (grievance, action, updatedBy) => {
    if (!grievance.history) {
        grievance.history = [];
    }

    const newLog = {
        action,
        updatedBy,
        timestamp: new Date()
    };

    grievance.history.push(newLog);
    return grievance;
};

module.exports = {
    appendHistoryEntry
};
