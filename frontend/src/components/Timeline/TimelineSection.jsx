import { useState, useEffect } from 'react';
import { Plus, Heart, Edit2, Trash2, X } from 'lucide-react';
import { timelineAPI } from '../../services/api';

const TimelineSection = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    emoji: '💕'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await timelineAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      alert('Error al cargar los eventos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEvent) {
        await timelineAPI.update(editingEvent._id, formData);
      } else {
        await timelineAPI.create(formData);
      }
      
      loadEvents();
      setShowModal(false);
      setFormData({ date: '', title: '', description: '', emoji: '💕' });
      setEditingEvent(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      emoji: event.emoji
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      await timelineAPI.delete(id);
      loadEvents();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el evento');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Nuestro Camino Juntos</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingEvent(null);
            setFormData({ date: '', title: '', description: '', emoji: '💕' });
          }}
          className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          <Plus size={20} />
          <span>Agregar Evento</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 to-purple-300"></div>
        
        {events.map((event, index) => (
          <div key={event._id} className={`mb-12 flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            <div className={`w-5/12 ${index % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition group relative">
                <div className="text-4xl mb-2">{event.emoji}</div>
                <p className="text-pink-500 font-semibold mb-2">{event.date}</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                
                {/* Botones de acción */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-2/12 flex justify-center">
              <div className="w-8 h-8 bg-pink-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                <Heart size={16} className="text-white" />
              </div>
            </div>
            <div className="w-5/12"></div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay eventos aún. ¡Agrega el primero!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Fecha</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Ej: 14 de Febrero, 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Nuestro Primer Encuentro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe este momento especial..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="💕"
                  maxLength="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                  onClick={() => setShowModal(false)}
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

export default TimelineSection;