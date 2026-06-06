import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataBar = [
  { name: 'Seg', aprovadas: 30, divergentes: 10, rejeitadas: 2 },
  { name: 'Ter', aprovadas: 45, divergentes: 15, rejeitadas: 1 },
  { name: 'Qua', aprovadas: 60, divergentes: 20, rejeitadas: 0 },
  { name: 'Qui', aprovadas: 50, divergentes: 10, rejeitadas: 3 },
  { name: 'Sex', aprovadas: 40, divergentes: 12, rejeitadas: 1 },
  { name: 'Sáb', aprovadas: 15, divergentes: 5, rejeitadas: 0 },
  { name: 'Dom', aprovadas: 10, divergentes: 2, rejeitadas: 0 },
];

const dataPie = [
  { name: 'Aprovadas', value: 380, color: '#48BB78' },
  { name: 'Divergentes', value: 110, color: '#ECC94B' },
  { name: 'Rejeitadas', value: 10, color: '#F56565' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Cards F-Pattern */}
        <div className="bg-white rounded-lg p-5 border-t-4 border-s_green shadow flex flex-col items-center">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">Aprovadas</p>
          <h2 className="text-4xl font-extrabold text-gray-800">380</h2>
          <p className="text-xs text-s_green font-semibold mt-2">Touchless | 100% Match</p>
        </div>
        <div className="bg-white rounded-lg p-5 border-t-4 border-s_yellow shadow flex flex-col items-center">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">Divergentes</p>
          <h2 className="text-4xl font-extrabold text-gray-800">110</h2>
          <p className="text-xs text-s_yellow font-semibold mt-2">Requer Ação</p>
        </div>
        <div className="bg-white rounded-lg p-5 border-t-4 border-s_red shadow flex flex-col items-center">
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">Rejeitadas</p>
          <h2 className="text-4xl font-extrabold text-gray-800">10</h2>
          <p className="text-xs text-s_red font-semibold mt-2">Bloqueio Financeiro</p>
        </div>
        <div className="bg-s_dark rounded-lg p-5 border-t-4 border-gray-400 shadow flex flex-col items-center">
          <p className="text-sm text-gray-300 font-bold uppercase mb-1">Touchless Rate</p>
          <h2 className="text-4xl font-extrabold text-white">77%</h2>
          <p className="text-xs text-s_green font-semibold mt-2">Volume Total: 500 nfs</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-6">Volume de Notas (Últimos 7 dias)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#718096'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#718096'}} />
                <Tooltip cursor={{fill: '#F7FAFC'}} />
                <Bar dataKey="aprovadas" stackId="a" fill="#48BB78" radius={[0,0,0,0]} />
                <Bar dataKey="divergentes" stackId="a" fill="#ECC94B" />
                <Bar dataKey="rejeitadas" stackId="a" fill="#F56565" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-700 w-full text-center">Distribuição Hoje</h3>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 w-full flex flex-col gap-3 text-sm text-gray-600 px-4">
            <div className="flex justify-between font-medium"><span className="flex items-center"><span className="w-3 h-3 rounded-full bg-s_green mr-2"></span>Aprovadas</span> <span>76%</span></div>
            <div className="flex justify-between font-medium"><span className="flex items-center"><span className="w-3 h-3 rounded-full bg-s_yellow mr-2"></span>Divergentes</span> <span>22%</span></div>
            <div className="flex justify-between font-medium"><span className="flex items-center"><span className="w-3 h-3 rounded-full bg-s_red mr-2"></span>Rejeitadas</span> <span>2%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}