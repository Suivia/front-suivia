import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const barData = [
  { name: 'Seg', aprovadas: 30, divergentes: 10, rejeitadas: 2 },
  { name: 'Ter', aprovadas: 45, divergentes: 15, rejeitadas: 1 },
  { name: 'Qua', aprovadas: 60, divergentes: 20, rejeitadas: 0 },
  { name: 'Qui', aprovadas: 50, divergentes: 10, rejeitadas: 3 },
  { name: 'Sex', aprovadas: 40, divergentes: 12, rejeitadas: 1 },
  { name: 'Sáb', aprovadas: 15, divergentes: 5,  rejeitadas: 0 },
  { name: 'Dom', aprovadas: 10, divergentes: 2,  rejeitadas: 0 },
]
const pieData = [
  { name: 'Aprovadas',   value: 380, color: '#48BB78' },
  { name: 'Divergentes', value: 110, color: '#ECC94B' },
  { name: 'Rejeitadas',  value: 10,  color: '#F56565' },
]
const topDiv = [
  { name: 'Kalunga',      v: 42 },
  { name: 'Dell',         v: 29 },
  { name: 'Transportes A',v: 18 },
  { name: 'Forneced. X',  v: 12 },
  { name: 'Forneced. Y',  v: 9  },
]

const KPI = ({ label, value, sub, border, dark }) => (
  <div className={`rounded-xl p-5 shadow-sm flex flex-col gap-1 border-t-4 ${border} ${dark ? 'bg-s_dark text-white' : 'bg-white'}`}>
    <p className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{label}</p>
    <p className={`text-4xl font-extrabold ${dark ? 'text-white' : 'text-gray-800'}`}>{value}</p>
    <p className={`text-xs font-semibold ${dark ? 'text-s_green' : 'text-gray-400'}`}>{sub}</p>
  </div>
)

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800">Dashboard Principal</h2>
        <p className="text-sm text-gray-400">Visão geral do dia — atualizado em tempo real</p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <KPI label="Aprovadas"     value="380" sub="Touchless | 100% Match" border="border-s_green"  />
        <KPI label="Divergentes"   value="110" sub="Requer Ação"            border="border-s_yellow" />
        <KPI label="Rejeitadas"    value="10"  sub="Bloqueio Financeiro"    border="border-s_red"    />
        <KPI label="Touchless Rate" value="77%" sub="Volume Total: 500 NFs" border="border-gray-500" dark />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Bar */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Volume de Notas — últimos 7 dias</h3>
          <p className="text-xs text-gray-400 mb-4">Stacked por status de conciliação</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F7FAFC' }} />
                <Bar dataKey="aprovadas"   stackId="a" fill="#48BB78" />
                <Bar dataKey="divergentes" stackId="a" fill="#ECC94B" />
                <Bar dataKey="rejeitadas"  stackId="a" fill="#F56565" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Distribuição Hoje</h3>
          <p className="text-xs text-gray-400 mb-2">500 notas processadas</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map(e => (
              <div key={e.name} className="flex justify-between text-xs font-medium text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: e.color }} />
                  {e.name}
                </span>
                <span className="font-bold">{Math.round(e.value/500*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Top Divergences */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Top Divergências por Fornecedor</h3>
          <div className="space-y-2">
            {topDiv.map(d => (
              <div key={d.name} className="flex items-center gap-3 text-xs">
                <span className="w-24 text-gray-600 truncate">{d.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-s_yellow rounded-full" style={{ width: `${(d.v/42)*100}%` }} />
                </div>
                <span className="font-bold text-gray-700 w-5 text-right">{d.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Log Eventos */}
        <div className="col-span-2 bg-s_darker rounded-xl p-5 shadow-sm font-mono text-xs text-gray-300 overflow-hidden">
          <h3 className="text-sm font-bold text-white mb-3 font-sans">Log de Eventos em Tempo Real</h3>
          <div className="space-y-1.5">
            {[
              { t: '14:52:01', c: 'text-s_green',  m: 'Lote #99843 [250/250] notas — processado automaticamente (100% match)' },
              { t: '14:51:33', c: 'text-s_yellow', m: 'Lote #99844 Nota NF-4328 com status Cancelada na SEFAZ — aguardando ação imediata' },
              { t: '14:50:22', c: 'text-s_red',    m: 'Nota #99844 NF-4328 divergência de preço — enviada para fila' },
              { t: '14:49:10', c: 'text-s_green',  m: 'Lote #99845 Operador aprovou NF-4329 com ressalva (justificativa registrada)' },
              { t: '14:48:07', c: 'text-gray-400', m: 'Fornecedor Dell Computadores — 5 notas sem Pedido de Compra vinculado' },
            ].map((e, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-gray-500 shrink-0">{e.t}</span>
                <span className={e.c}>{e.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
