const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  song: {
    type: String,
    required: [true, 'El nombre de la canción es requerido'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'El artista es requerido'],
    trim: true
  },
  reason: {
    type: String,
    required: [true, 'La razón es requerida'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', SongSchema);