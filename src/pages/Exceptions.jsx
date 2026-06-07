import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'

const DATA = [
  { id:1, sev:'critical', nf:'NF-5391', sup:'Thomas Rep',  type:'Sem PC Vinculado', exp:'—',         real:'—',           diff:'—',        actions:['Vincular PC','Rejeitar'] },
  { id:2, sev:'alta',     nf:'NF-4598', sup:'Dan Criha',   type:'Preço Divergente', exp:'R$1.700,21', real:'R$2.350,33', diff:'R$650,12', actions:['Aprovar c/ Ressalva','Rejeitar'] },
  { id:3, sev:'media',    nf:'NF-4955', sup:'Karonga',      type:'Qtd Divergente',  exp:'10 un',      real:'12 un',       diff:'+2 un',    actions:['Auto-aprovar','Rejeitar'] },
  { id:4, sev:'baixa',    nf:'NF-4621', sup:'Papelaria B', type:'Imposto Arredond.',exp:'R$ 13,30',   real:'R$13,240',    diff:'-R$0,06',  actions:['Auto-aprovar','Ignorar'] },
  { id:5, sev:'critical', nf:'NF-4624', sup:'TONN',        type:'CNPJ Mismatch',   exp:'12.345.678', real:'98.765.432',  diff:'—',        actions:['Rejeitar Crítico'] },
]

const sevColor = { critical:'bg-red-600 text-white', alta:'bg-red-100 text-red-800', media:'bg-yellow-100 text-yellow-800', baixa:'bg-gray-100 text-gray-600' }

export default function Exceptions() {
  const [bulk, setBulk] = useState('')
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bulk */}
      <div className="p-4 border-b bg-red-50 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-extrabold text-red-900">Resolução em Massa</p>
          <p className="text-xs text-red-700">Aprovar divergências de PREÇO abaixo de R$:</p>
        </div>
        <input type="number" value={bulk} onChange={e=>setBulk(e.target.value)} placeholder="500,00"
          className="border border-red-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-red-400" />
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg shadow transition">
          Aplicar ({DATA.filter(d=>d.sev!=='critical').length} notas)
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-s_dark text-white text-xs uppercase tracking-wider">
              {['Severidade','NF','Fornecedor','Tipo Diverg.','Vl. Esperado','Vl. Real','Diferença','Ações'].map(h=>(
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATA.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${sevColor[row.sev]}`}>{row.sev}</span>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-gray-700">{row.nf}</td>
                <td className="px-4 py-3 text-gray-600">{row.sup}</td>
                <td className="px-4 py-3 text-gray-600 font-medium">{row.type}</td>
                <td className="px-4 py-3 font-mono text-gray-600">{row.exp}</td>
                <td className="px-4 py-3 font-mono text-gray-700 font-semibold">{row.real}</td>
                <td className="px-4 py-3 font-bold text-red-600">{row.diff}</td>
                <td className="px-4 py-3 flex gap-1 flex-wrap">
                  {row.actions.map(a => (
                    <button key={a} className="px-3 py-1 bg-s_dark text-white text-xs rounded-lg hover:bg-gray-700 transition whitespace-nowrap">{a}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex gap-4">
        <span>Total: {DATA.length} exceções</span>
        <span className="text-red-600 font-semibold">Críticas: {DATA.filter(d=>d.sev==='critical').length}</span>
        <span className="text-yellow-600 font-semibold">Altas: {DATA.filter(d=>d.sev==='alta').length}</span>
        <span className="text-gray-500">Médias+Baixas: {DATA.filter(d=>['media','baixa'].includes(d.sev)).length}</span>
      </div>
    </div>
  )
}
