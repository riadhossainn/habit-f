import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ListChecks, 
  BarChart3, 
  Bot, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import Statistics from './components/Statistics';
import AIAssistant from './components/AIAssistant';
import LoginPage from './components/LoginPage';
import type { User } from './types';

type Page = 'dashboard' | 'habits' | 'statistics' | 'ai';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits' as Page, label: 'My Habits', icon: ListChecks },
    { id: 'statistics' as Page, label: 'Statistics', icon: BarChart3 },
    { id: 'ai' as Page, label: 'AI Assistant', icon: Bot },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'habits': return <HabitList user={user} />;
      case 'statistics': return <Statistics user={user} />;
      case 'ai': return <AIAssistant user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🌊</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">HabitFlow</h1>
              <p className="text-xs text-gray-500">Smart Habit Tracker</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-medium">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-gray-900">HabitFlow</h1>
          <button onClick={() => setUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
