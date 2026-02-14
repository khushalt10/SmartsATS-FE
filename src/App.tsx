import { useState } from 'react';
import { Layout, Briefcase, FileText, Settings, Plus } from 'lucide-react';
import KanbanBoard from './components/KanbanBoard';
import AddApplicationModal from './components/AddApplicationModal';

function App() {
  const [activeTab, setActiveTab] = useState('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SmartATS
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem
            icon={<Layout size={20} />}
            label="Board"
            active={activeTab === 'board'}
            onClick={() => setActiveTab('board')}
          />
          <SidebarItem
            icon={<Briefcase size={20} />}
            label="Applications"
            active={activeTab === 'applications'}
            onClick={() => setActiveTab('applications')}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="Resumes"
            active={activeTab === 'resumes'}
            onClick={() => setActiveTab('resumes')}
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900">
          <h2 className="text-lg font-semibold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} />
            <span>New Application</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          {activeTab === 'board' && <KanbanBoard key={refreshKey} />}
          {activeTab !== 'board' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Work in progress...
            </div>
          )}
        </div>

        {showAddModal && (
          <AddApplicationModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => setRefreshKey(k => k + 1)}
          />
        )}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default App;
