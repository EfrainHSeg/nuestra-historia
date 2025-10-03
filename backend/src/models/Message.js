const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'El remitente es requerido'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);