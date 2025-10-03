import { useState } from 'react';
import { Heart, Calendar, Image, Music, MessageCircle, LogOut } from 'lucide-react';
import TimelineSection from '../Timeline/TimelineSection';
import MemoriesSection from '../Memories/MemoriesSection';
import SongsSection from '../Songs/SongsSection';
import MessagesSection from '../Messages/MessagesSection';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('timeline');

  const menuItems = [
    { id: 'timeline', icon: Calendar, label: 'Línea de Tiempo' },
    { id: 'memories', icon: Image, label: 'Recuerdos' },
    { id: 'songs', icon: Music, label: 'Playlist' },
    { id: 'messages', icon: MessageCircle, label: 'Mensajes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Nuestra Historia
            </h1>
            <p className="text-gray-600 mt-1">Bienvenido/a, {user?.name} ❤️</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm mt-4 mx-4 rounded-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-2 md:space-x-8 py-4 flex-wrap gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition ${
                    activeSection === item.id
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-pink-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm md:text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'timeline' && <TimelineSection />}
        {activeSection === 'memories' && <MemoriesSection />}
        {activeSection === 'songs' && <SongsSection />}
        {activeSection === 'messages' && <MessagesSection user={user} />}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8">
        <div className="text-center">
          <Heart className="inline-block text-pink-500 mb-2" size={32} />
          <p className="text-gray-600">Hecho con amor para nosotros 💕</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;