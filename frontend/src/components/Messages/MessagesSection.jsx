import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Heart } from 'lucide-react';
import { messagesAPI } from '../../services/api';

const MessagesSection = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      alert('Error al cargar los mensajes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await messagesAPI.create({ content: newMessage });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    try {
      await messagesAPI.delete(id);
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el mensaje');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <Heart className="text-pink-500 mr-3" size={32} />
        <h2 className="text-3xl font-bold text-gray-800">Nuestros Mensajes</h2>
        <Heart className="text-pink-500 ml-3" size={32} />
      </div>

      {/* Contenedor de mensajes */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4" style={{ height: '500px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">No hay mensajes aún. ¡Escribe el primero!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMyMessage = message.sender === user.name;
              return (
                <div
                  key={message._id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg group relative ${
                      isMyMessage
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    } rounded-lg p-4 shadow`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-semibold text-sm ${isMyMessage ? 'text-pink-100' : 'text-pink-600'}`}>
                        {message.sender}
                      </p>
                      {isMyMessage && (
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} className="text-white hover:text-red-200" />
                        </button>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-xs mt-2 ${isMyMessage ? 'text-pink-100' : 'text-gray-500'}`}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Formulario para enviar mensajes */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 flex space-x-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje de amor..."
          rows="2"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Send size={20} />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-4">
        💡 Presiona Enter para enviar, Shift+Enter para nueva línea
      </p>
    </div>
  );
};

export default MessagesSection;