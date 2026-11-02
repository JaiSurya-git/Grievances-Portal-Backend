const { generateGrievanceId } = require('./idService');
const { appendHistoryEntry } = require('./historyService');

const grievancesDatabase = [];

const createGrievance = (studentData, studentId) => {
    const grievanceId = generateGrievanceId();

    let newGrievance = {
        grievanceId,
        studentId,
        title: studentData.title,
        description: studentData.description,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        history: []
    };

    newGrievance = appendHistoryEntry(newGrievance, "Grievance submitted by student.", "Student");
    grievancesDatabase.push(newGrievance);

    return newGrievance;
};

module.exports = {
    createGrievance,
    grievancesDatabase
};
