import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Inbox, AlertTriangle, Layers, Camera, Settings } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link to={to} className={`flex items-center px-6 py-4 transition-colors ${active ? 'bg-gray-800 border-l-4 border-s_green text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside className="w-64 bg-s_dark text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-700">
            <div className="w-8 h-8 rounded-full bg-s_green flex items-center justify-center text-s_dark font-bold text-lg mr-3">S</div>
            <span className="text-xl font-bold tracking-widest">SUIVIA</span>
          </div>
          <nav className="mt-4 space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/inbox" icon={Inbox} label="Inbox" />
            <NavItem to="/exceptions" icon={AlertTriangle} label="Exceções" />
            <NavItem to="/batches" icon={Layers} label="Lotes" />
            <NavItem to="/camera" icon={Camera} label="Câmera" />
          </nav>
        </div>
        <div className="p-6">
          <button className="flex items-center text-gray-400 hover:text-white transition">
            <Settings className="w-5 h-5 mr-3" /> Configurações
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
           <div>
              <h1 className="text-xl font-bold text-gray-800">Módulo de Recebimento Fiscal</h1>
           </div>
           <div className="flex items-center text-sm font-medium text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-s_green flex items-center justify-center mr-2">O</div>
              Operador Logado
           </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}