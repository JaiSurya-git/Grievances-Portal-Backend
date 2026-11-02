let currentCounter = 1;

const generateGrievanceId = () => {
    const year = 2026;
    const paddedCounter = String(currentCounter).padStart(3, '0');
    currentCounter++; 
    return `GRV-${year}-${paddedCounter}`;
};

module.exports = {
    generateGrievanceId
};
