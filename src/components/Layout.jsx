import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Inbox, AlertTriangle, Layers, Camera, Settings, Bell } from 'lucide-react'

const nav = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/inbox',      icon: Inbox,           label: 'Inbox'       },
  { to: '/exceptions', icon: AlertTriangle,   label: 'Exceções'    },
  { to: '/batches',    icon: Layers,          label: 'Lotes'       },
  { to: '/camera',     icon: Camera,          label: 'Câmera'      },
]

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-60 bg-s_darker text-white flex flex-col shrink-0 shadow-2xl">
        <div className="h-16 flex items-center px-5 border-b border-gray-700 gap-3">
          <div className="w-8 h-8 rounded-lg bg-s_green flex items-center justify-center font-extrabold text-s_darker text-lg">S</div>
          <span className="text-lg font-extrabold tracking-widest">SUIVIA</span>
        </div>

        <nav className="flex-1 mt-3 space-y-0.5 px-2">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all gap-3
                 ${isActive ? 'bg-gray-700 text-white border-l-4 border-s_green pl-3' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center text-gray-400 hover:text-white text-sm gap-2 transition">
            <Settings className="w-4 h-4" /> Configurações
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-800">Módulo de Recebimento Fiscal</h1>
            <p className="text-xs text-gray-400">SUIVIA v2.0 — Sistema Fiscal Inteligente</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-s_red rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-8 h-8 rounded-full bg-s_green flex items-center justify-center text-s_darker font-bold text-sm">O</div>
              Operador
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
