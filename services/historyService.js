const appendHistoryEntry = (
    grievance,
    action,
    updatedBy,
    updatedByRole,
    status,
    remark = ''
) => {
    grievance.actionHistory.push({
        action,
        updatedBy,
        updatedByRole,
        status,
        remark,
        updatedAt: new Date()
    });

    return grievance;
};

module.exports = { appendHistoryEntry };