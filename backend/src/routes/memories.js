const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'memory-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// @route   GET /api/memories
// @desc    Obtener todas las memorias
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   POST /api/memories
// @desc    Crear nueva memoria con imagen
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, color } = req.body;

    // Validar campos requeridos
    if (!title || !description) {
      return res.status(400).json({ error: 'Título y descripción son requeridos' });
    }

    const memoryData = {
      title,
      description,
      color: color || 'bg-pink-100',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };

    const memory = new Memory(memoryData);
    await memory.save();
    
    res.status(201).json(memory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   PUT /api/memories/:id
// @desc    Actualizar memoria
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, color } = req.body;

    const updateData = {
      title,
      description,
      color
    };

    // Si se subió una nueva imagen, actualizarla
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const memory = await Memory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ error: 'Memoria no encontrada' });
    }

    res.json(memory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// @route   DELETE /api/memories/:id
// @desc    Eliminar memoria
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);

    if (!memory) {
      return res.status(404).json({ error: 'Memoria no encontrada' });
    }

    res.json({ message: 'Memoria eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;