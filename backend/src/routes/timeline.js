const express = require('express');
const router = express.Router();
const TimelineEvent = require('../models/TimelineEvent');
const auth = require('../middleware/auth');

// @route   GET /api/timeline
// @desc    Obtener todos los eventos
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ createdAt: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   POST /api/timeline
// @desc    Crear nuevo evento
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, title, description, emoji } = req.body;

    // Validar campos requeridos
    if (!date || !title || !description) {
      return res.status(400).json({ error: 'Fecha, título y descripción son requeridos' });
    }

    const event = new TimelineEvent({
      date,
      title,
      description,
      emoji: emoji || '💕'
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   PUT /api/timeline/:id
// @desc    Actualizar evento
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, title, description, emoji } = req.body;

    const event = await TimelineEvent.findByIdAndUpdate(
      req.params.id,
      { date, title, description, emoji },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   DELETE /api/timeline/:id
// @desc    Eliminar evento
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await TimelineEvent.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;