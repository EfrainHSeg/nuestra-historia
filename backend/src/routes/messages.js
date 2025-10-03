const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// @route   GET /api/messages
// @desc    Obtener todos los mensajes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   POST /api/messages
// @desc    Crear nuevo mensaje
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Validar campo requerido
    if (!content) {
      return res.status(400).json({ error: 'El contenido es requerido' });
    }

    const message = new Message({
      sender: req.user.name, // Del token JWT
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Eliminar mensaje
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;