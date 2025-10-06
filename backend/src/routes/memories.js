const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nuestra-historia',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
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

    if (!title || !description) {
      return res.status(400).json({ error: 'Título y descripción son requeridos' });
    }

    const memoryData = {
      title,
      description,
      color: color || 'bg-pink-100',
      imageUrl: req.file ? req.file.path : null
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

    const updateData = { title, description, color };

    if (req.file) {
      updateData.imageUrl = req.file.path;
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

// @route   POST /api/memories/:id/like
// @desc    Dar/quitar like a una memoria
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ error: 'Memoria no encontrada' });
    }

    const userId = req.user.id;
    const likedIndex = memory.likedBy.indexOf(userId);

    if (likedIndex > -1) {
      // Ya le dio like, entonces quitarlo
      memory.likedBy.splice(likedIndex, 1);
      memory.likes = Math.max(0, memory.likes - 1);
    } else {
      // Agregar like
      memory.likedBy.push(userId);
      memory.likes += 1;
    }

    await memory.save();
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