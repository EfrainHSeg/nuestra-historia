require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const timelineRoutes = require('./routes/timeline');
const memoriesRoutes = require('./routes/memories');
const songsRoutes = require('./routes/songs');
const messagesRoutes = require('./routes/messages');

// Inicializar Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/messages', messagesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '❤️ API de Nuestra Historia funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Base de datos: ${process.env.MONGODB_URI}`);
  console.log(`💕 Nuestra Historia API lista!\n`);
});