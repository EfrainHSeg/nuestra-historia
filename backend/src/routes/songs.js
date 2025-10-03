const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// @route   GET /api/songs
// @desc    Obtener todas las canciones
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   POST /api/songs
// @desc    Crear nueva canción
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { song, artist, reason } = req.body;

    // Validar campos requeridos
    if (!song || !artist || !reason) {
      return res.status(400).json({ error: 'Canción, artista y razón son requeridos' });
    }

    const newSong = new Song({
      song,
      artist,
      reason
    });

    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   PUT /api/songs/:id
// @desc    Actualizar canción
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { song, artist, reason } = req.body;

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      { song, artist, reason },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    res.json(updatedSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   DELETE /api/songs/:id
// @desc    Eliminar canción
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    res.json({ message: 'Canción eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;