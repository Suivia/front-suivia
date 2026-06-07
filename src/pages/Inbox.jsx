import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import ScoreBar    from '../components/ScoreBar'

const ALL = [
  { id:1, status:'aprovada',  nf:'000.004.590', supplier:'Kalunga S/A',           val:'R$ 1.250,50', score:'100%', pc:'PC-440011', source:'XML'    },
  { id:2, status:'divergente',nf:'000.004.598', supplier:'Kalunga S/A',           val:'R$ 1.302,55', score:'82%',  pc:'PC-443011', source:'XML'    },
  { id:3, status:'rejeitada', nf:'000.002.841', supplier:'Dell Computadores',      val:'R$25.000,00', score:'28%',  pc:'Nenhum',    source:'PDF'    },
  { id:4, status:'aprovada',  nf:'000.003.121', supplier:'Transportadora Rápida',  val:'R$ 800,20',   score:'100%', pc:'PC-447022', source:'XML'    },
  { id:5, status:'aprovada',  nf:'000.004.651', supplier:'Microsoft Brasil',        val:'R$ 3.500,00', score:'100%', pc:'PC-460021', source:'XML'    },
  { id:6, status:'divergente',nf:'000.008.902', supplier:'Armazém XYZ',            val:'R$ 8.200,00', score:'75%',  pc:'PC-460044', source:'Upload' },
  { id:7, status:'rejeitada', nf:'000.009.010', supplier:'Transporte Fast',        val:'R$ 500,00',   score:'21%',  pc:'Nenhum',    source:'Email'  },
]

export default function Inbox() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('todas')
  const items = filter === 'todas' ? ALL : ALL.filter(i => i.status === filter)

  const FilterBtn = ({ label, value, color }) => (
    <button onClick={() => setFilter(value)}
      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition border
        ${filter === value ? color + ' shadow' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
      {label}
    </button>
  )

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center rounded-t-xl">
        <div>
          <h2 className="text-base font-extrabold text-gray-800">Inbox de Notas Fiscais</h2>
          <p className="text-xs text-gray-400">{ALL.length} notas — atualizado agora</p>
        </div>
        <div className="flex gap-2">
          <FilterBtn label="Todas"       value="todas"      color="bg-s_dark text-white border-s_dark" />
          <FilterBtn label="Aprovadas"   value="aprovada"   color="bg-green-500 text-white border-green-500" />
          <FilterBtn label="Divergentes" value="divergente" color="bg-yellow-400 text-gray-900 border-yellow-400" />
          <FilterBtn label="Rejeitadas"  value="rejeitada"  color="bg-red-500 text-white border-red-500" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-s_dark text-white text-xs uppercase tracking-wider">
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Nro NF</th>
              <th className="px-5 py-3">Fornecedor</th>
              <th className="px-5 py-3">Valor</th>
              <th className="px-5 py-3 w-40">Score Match</th>
              <th className="px-5 py-3">PC Vinculado</th>
              <th className="px-5 py-3">Origem</th>
              <th className="px-5 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(inv => (
              <tr key={inv.id} className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/inbox/${inv.id}`)}>
                <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-5 py-3 font-bold text-gray-700 font-mono">{inv.nf}</td>
                <td className="px-5 py-3 text-gray-600 font-medium">{inv.supplier}</td>
                <td className="px-5 py-3 font-bold text-gray-800">{inv.val}</td>
                <td className="px-5 py-3"><ScoreBar score={inv.score} /></td>
                <td className="px-5 py-3 text-gray-500 text-xs font-mono">{inv.pc}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{inv.source}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button onClick={e => { e.stopPropagation(); navigate(`/inbox/${inv.id}`) }}
                    className="bg-s_dark hover:bg-gray-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow transition">
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer bulk actions */}
      <div className="p-4 border-t bg-s_dark rounded-b-xl flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-300">Resolução em Lote:</span>
        <div className="flex gap-3">
          <button className="bg-s_green hover:bg-green-600 text-white px-5 py-2 text-xs font-bold rounded-lg shadow transition">✓ Aprovar Lote</button>
          <button className="bg-s_yellow hover:bg-yellow-500 text-gray-900 px-5 py-2 text-xs font-bold rounded-lg shadow transition">⚠ Aprovar c/ Ressalva</button>
          <button className="bg-s_red hover:bg-red-600 text-white px-5 py-2 text-xs font-bold rounded-lg shadow transition">✕ Rejeitar Lote</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold rounded-lg shadow transition">🔗 Vincular PC</button>
        </div>
      </div>
    </div>
  )
}
