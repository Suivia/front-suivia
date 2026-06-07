const BATCHES = [
  { id:'#99843', origin:'Email', start:'10:32', total:356, aprov:344, diverg:10, reject:2,  status:'CONCLUÍDO',       prog:100 },
  { id:'#99851', origin:'API',   start:'10:15', total:254, aprov:200, diverg:44, reject:10, status:'EM PROCESSAMENTO', prog:78  },
  { id:'#99866', origin:'Upload',start:'09:45', total:540, aprov:510, diverg:28, reject:2,  status:'CONCLUÍDO',       prog:100 },
  { id:'#99871', origin:'Email', start:'09:10', total:325, aprov:313, diverg:8,  reject:4,  status:'CONCLUÍDO',       prog:100 },
  { id:'#99935', origin:'API',   start:'07:06', total:90,  aprov:76,  diverg:13, reject:1,  status:'CONCLUÍDO',       prog:100 },
]

const STATUS_C = { 'CONCLUÍDO':'bg-green-100 text-green-800', 'EM PROCESSAMENTO':'bg-yellow-100 text-yellow-800', 'ERRO':'bg-red-100 text-red-800' }

export default function Batches() {
  const kpis = [
    { label:'Processadas Hoje', val:'1.250', color:'border-s_green' },
    { label:'Em Processamento', val:'2',     color:'border-s_yellow' },
    { label:'Taxa de Sucesso',  val:'94%',   color:'border-s_green' },
    { label:'Tempo Médio',      val:'1m 42s',color:'border-gray-400' },
  ]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-5">
        {kpis.map(k => (
          <div key={k.label} className={`bg-white rounded-xl p-5 shadow-sm border-t-4 ${k.color}`}>
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{k.label}</p>
            <p className="text-3xl font-extrabold text-gray-800">{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-extrabold text-gray-800">Monitoramento de Lotes em Tempo Real</h2>
          <p className="text-xs text-gray-400">Atualização automática via WebSocket</p>
        </div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-s_dark text-white text-xs uppercase tracking-wider">
              {['ID Lote','Origem','Início','Total','Aprov','Diverg','Reject','Status','Progresso','Ações'].map(h=>(
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BATCHES.map(b => (
              <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-gray-700">{b.id}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{b.origin}</span></td>
                <td className="px-4 py-3 text-gray-500 font-mono">{b.start}</td>
                <td className="px-4 py-3 font-bold">{b.total}</td>
                <td className="px-4 py-3 font-bold text-green-700">{b.aprov}</td>
                <td className="px-4 py-3 font-bold text-yellow-600">{b.diverg}</td>
                <td className="px-4 py-3 font-bold text-red-600">{b.reject}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${STATUS_C[b.status]??''}`}>{b.status}</span></td>
                <td className="px-4 py-3 w-36">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-2 bg-s_green rounded-full" style={{ width: `${b.prog}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{b.prog}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="px-3 py-1 bg-s_dark text-white text-xs rounded-lg hover:bg-gray-700 transition">Ver Notas</button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition">Relatório</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Log Events */}
        <div className="p-4 bg-s_darker font-mono text-xs text-gray-300 border-t border-gray-700 space-y-1.5">
          <p className="text-white font-sans font-bold text-sm mb-2">Log de Eventos em Tempo Real</p>
          {[
            ['text-s_green',  '✔ Lote #99843 [250/250] notas processadas automaticamente (100% match)'],
            ['text-s_yellow', '⚠ Lote #99844 Nota NF-4328 com status Cancelada na SEFAZ — aguardando ação imediata'],
            ['text-s_red',    '✕ Nota #99844 NF-4328 divergência de preço (+R$650) — enviada para fila'],
            ['text-s_green',  '✔ Lote #99845 Operador aprovou NF-4329 com ressalva (justificativa registrada)'],
          ].map(([c,m],i) => <p key={i} className={c}>{m}</p>)}
        </div>
      </div>
    </div>
  )
}
