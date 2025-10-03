const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'La fecha es requerida']
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  emoji: {
    type: String,
    default: '💕'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimelineEvent', TimelineEventSchema);