import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Heart } from 'lucide-react';
import { memoriesAPI } from '../../services/api';

const MemoriesSection = () => {
  const [memories, setMemories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: 'bg-pink-100'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = [
    'bg-pink-100',
    'bg-purple-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-red-100',
    'bg-indigo-100',
    'bg-orange-100'
  ];

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const response = await memoriesAPI.getAll();
      setMemories(response.data);
    } catch (error) {
      console.error('Error cargando memorias:', error);
      alert('Error al cargar las memorias');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('color', formData.color);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingMemory) {
        await memoriesAPI.update(editingMemory._id, formDataToSend);
      } else {
        await memoriesAPI.create(formDataToSend);
      }
      
      loadMemories();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la memoria');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (memoryId) => {
    try {
      const response = await memoriesAPI.toggleLike(memoryId);
      // Actualizar la memoria en el estado local
      setMemories(memories.map(mem => 
        mem._id === memoryId ? response.data : mem
      ));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const isLikedByCurrentUser = (memory) => {
    const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;
    return memory.likedBy?.includes(currentUserId);
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      description: memory.description,
      color: memory.color
    });
    setImagePreview(memory.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta memoria?')) return;

    try {
      await memoriesAPI.delete(id);
      loadMemories();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la memoria');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMemory(null);
    setFormData({ title: '', description: '', color: 'bg-pink-100' });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Galería de Recuerdos</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingMemory(null);
            setFormData({ title: '', description: '', color: 'bg-pink-100' });
          }}
          className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          <Plus size={20} />
          <span>Agregar Recuerdo</span>
        </button>
      </div>

      {/* Grid de memorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div
            key={memory._id}
            className={`${memory.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 group relative`}
          >
            {memory.imageUrl ? (
              <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center">
                <Upload size={48} className="text-gray-300" />
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{memory.title}</h3>
            <p className="text-gray-700 mb-3">{memory.description}</p>

            {/* Botón de Me encanta */}
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={() => handleLike(memory._id)}
                className="flex items-center space-x-1 group/like transition"
              >
                <Heart
                  size={24}
                  className={`transition-all ${
                    isLikedByCurrentUser(memory)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>
              {memory.likes > 0 && (
                <span className="text-sm text-gray-600 font-semibold">
                  {memory.likes} {memory.likes === 1 ? 'me encanta' : 'les encanta'}
                </span>
              )}
            </div>

            {/* Botones de acción */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(memory)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(memory._id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay recuerdos aún. ¡Agrega el primero!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-md w-full my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingMemory ? 'Editar Recuerdo' : 'Nuevo Recuerdo'}
              </h3>
              <button onClick={closeModal}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Atardecer en la playa"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe este recuerdo..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Color de fondo</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg ${color} ${
                        formData.color === color ? 'ring-4 ring-pink-500' : 'ring-2 ring-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
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

export default MemoriesSection;