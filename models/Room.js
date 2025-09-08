const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    rentPaid: {
      type: Boolean,
      default: false
    },
    personalExpenses: {
      type: Number,
      default: 0
    },
    contributedToFund: {
      type: Number,
      default: 0
    },
    individualRentAmount: {
      type: Number,
      default: 0
    },
    paidRentAmount: {
      type: Number,
      default: 0
    }
  }],
  rentAmount: {
    type: Number,
    default: 0
  },
  rentDueDate: {
    type: String,
    default: '1'
  },
  currentRentCycle: {
    type: String
  },
  expenses: [{
    title: String,
    amount: Number,
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    splitBetween: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      amount: Number,
      paid: {
        type: Boolean,
        default: false
      }
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tasks: [{
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    weekNumber: Number,
    year: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);