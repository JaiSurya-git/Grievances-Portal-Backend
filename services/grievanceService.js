const Grievance = require('../models/Grievance');
const { generateGrievanceId } = require('./idService');
const { appendHistoryEntry } = require('./historyService');

const createGrievance = async (studentData, studentId) => {
    const grievanceId = await generateGrievanceId();

    const grievance = new Grievance({
        grievanceId,
        studentId,
        title: studentData.title,
        description: studentData.description,
        category: studentData.category,
        concernedPerson: studentData.concernedPerson,
        status: 'Submitted',
        actionHistory: []
    });

    appendHistoryEntry(
        grievance,
        'Grievance submitted by student',
        studentId,
        'student',
        'Submitted'
    );

    return await grievance.save();
};

module.exports = { createGrievance };