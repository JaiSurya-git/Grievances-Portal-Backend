const mongoose = require('mongoose');

// Sub-schema for tracking timeline changes
const actionHistorySchema = new mongoose.Schema({
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  status: {
    type: String,
    required: true
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
    required: true
  },
  status: {
    type: String,
    default: 'submitted' 
  },
  actionHistory: [actionHistorySchema] // Embedded sub-schema array
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
