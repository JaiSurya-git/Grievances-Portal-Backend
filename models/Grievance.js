const mongoose = require('mongoose');
const { GRIEVANCE_STATUSES } = require('../utils/constants');

// Sub-schema for tracking timeline changes
const actionHistorySchema = new mongoose.Schema({
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  
  status: {
  type: String,
  enum: GRIEVANCE_STATUSES,
  default: 'Submitted'
  },
  remark: {
    type: String,
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const grievanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: GRIEVANCE_CATEGORIES
  },
  status: {
    type: String,
    default: 'submitted' 
  },
  actionHistory: [actionHistorySchema] // Embedded sub-schema array
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
