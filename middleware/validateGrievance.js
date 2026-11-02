const { GRIEVANCE_CATEGORIES } = require('../utils/constants');

const validateGrievance = (req, res, next) => {
    const { title, description, category, concernedPerson } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({
            message: 'Title, description and category are required'
        });
    }

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Invalid title' });
    }

    if (typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({ message: 'Invalid description' });
    }

    if (!GRIEVANCE_CATEGORIES.includes(category)) {
        return res.status(400).json({
            message: 'Invalid grievance category',
            allowedCategories: GRIEVANCE_CATEGORIES
        });
    }

    if (
        concernedPerson !== undefined &&
        (typeof concernedPerson !== 'string' || !concernedPerson.trim())
    ) {
        return res.status(400).json({
            message: 'Invalid concerned person'
        });
    }

    next();
};

module.exports = validateGrievance;