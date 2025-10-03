import { useState, useEffect } from 'react';
import { Plus, Music, Edit2, Trash2, X } from 'lucide-react';
import { songsAPI } from '../../services/api';

const SongsSection = () => {
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    song: '',
    artist: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const response = await songsAPI.getAll();
      setSongs(response.data);
    } catch (error) {
      console.error('Error cargando canciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSong) {
        await songsAPI.update(editingSong._id, formData);
      } else {
        await songsAPI.create(formData);
      }
      
      loadSongs();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la canción');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      song: song.song,
      artist: song.artist,
      reason: song.reason
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta canción?')) return;

    try {
      await songsAPI.delete(id);
      loadSongs();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la canción');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSong(null);
    setFormData({ song: '', artist: '', reason: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Canciones Que Nos Definen</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingSong(null);
            setFormData({ song: '', artist: '', reason: '' });
          }}
          className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          <Plus size={20} />
          <span>Agregar Canción</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition flex items-start space-x-4 group relative"
          >
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
              <Music size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{song.song}</h3>
                  <p className="text-gray-500 mb-2">{song.artist}</p>
                  <p className="text-gray-600 italic">💭 {song.reason}</p>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(song)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(song._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay canciones aún. ¡Agrega la primera!</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingSong ? 'Editar Canción' : 'Nueva Canción'}
              </h3>
              <button onClick={closeModal}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre de la canción</label>
                <input
                  type="text"
                  value={formData.song}
                  onChange={(e) => setFormData({ ...formData, song: e.target.value })}
                  placeholder="Ej: Perfect"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Artista</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="Ej: Ed Sheeran"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">¿Por qué es especial?</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Ej: Nuestra canción especial, la que bailamos por primera vez"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsSection;