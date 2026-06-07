import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Zap, LinkIcon } from 'lucide-react'

export default function InvoiceDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <div className="flex flex-col bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow" style={{ height: 'calc(100vh - 112px)' }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-s_darker text-white shrink-0">
        <button className="flex items-center gap-2 hover:text-s_green transition text-sm" onClick={() => navigate('/inbox')}>
          <ArrowLeft className="w-4 h-4" />
          <div>
            <p className="font-bold">Detalhe da Nota Fiscal — Conciliação (Split-Screen)</p>
            <p className="text-xs text-gray-400 font-mono">NF 000.002.841 | Dell Computadores | R$ 25.000,00</p>
          </div>
        </button>
        <div className="text-sm text-gray-300 flex items-center gap-2">
          Score de Match:
          <span className="text-s_yellow font-extrabold text-xl border border-s_yellow px-3 py-0.5 rounded-lg ml-1">45%</span>
          <span className="ml-3 px-2 py-1 bg-yellow-500 text-gray-900 text-xs font-bold rounded uppercase">Divergente</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Document Viewer ── */}
        <div className="w-1/2 flex flex-col bg-gray-200 border-r border-gray-300">
          <div className="bg-white text-xs font-bold text-gray-600 p-2.5 border-b flex justify-between items-center">
            <span>📄 Visualizador do Documento Original (DANFE/PDF)</span>
            <button className="text-blue-500 text-xs hover:underline">+ Zoom</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white shadow-xl mx-auto max-w-sm p-6 relative ring-1 ring-gray-200 rounded">
              {/* Bounding boxes mock (RF03) */}
              <div className="absolute top-[72px] left-[20px] w-[220px] h-[22px] bg-green-400 opacity-20 border-2 border-green-500 rounded pointer-events-none z-10" />
              <div className="absolute top-[290px] left-[20px] w-[260px] h-[22px] bg-red-400 opacity-25 border-2 border-red-500 rounded pointer-events-none z-10" />

              <div className="text-center mb-4 border-b pb-3">
                <h1 className="text-xl font-black tracking-widest uppercase">DANFE</h1>
                <p className="text-xs text-gray-500 mt-1">Documento Auxiliar da Nota Fiscal Eletrônica</p>
              </div>
              <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded border">
                <div className="flex justify-between"><span className="font-bold">Nº</span><span className="font-mono">000.002.841</span></div>
                <div className="flex justify-between"><span className="font-bold">Série</span><span>1</span></div>
              </div>
              <div className="border border-gray-300 rounded p-2 mb-4 text-xs">
                <p className="font-bold text-gray-500 text-[10px] uppercase mb-1">Emitente</p>
                <p className="font-semibold">Dell Computadores do Brasil Ltda.</p>
                <p className="text-gray-500 font-mono">CNPJ: 72.381.189/0001-10</p>
              </div>
              <div className="border-2 border-gray-800 rounded p-2 mb-5 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-xs">VALOR TOTAL:</span>
                <span className="font-black text-base">R$ 25.000,00</span>
              </div>
              <table className="w-full text-[11px] border border-gray-200 rounded overflow-hidden">
                <thead className="bg-gray-100 border-b">
                  <tr><th className="p-1.5 text-left">Cód.</th><th className="p-1.5 text-left">Descrição</th><th className="p-1.5 text-center">Qtd</th><th className="p-1.5 text-right">V.Unit</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-1.5">01902</td><td className="p-1.5">Notebook Inspiron 15</td><td className="p-1.5 text-center">2</td><td className="p-1.5 text-right">R$4.500</td></tr>
                  <tr className="bg-red-50"><td className="p-1.5">49201</td><td className="p-1.5 font-semibold text-red-700">Mouse Sem Fio Pro</td><td className="p-1.5 text-center font-black text-red-700">20</td><td className="p-1.5 text-right">R$100</td></tr>
                </tbody>
              </table>
              <p className="text-[9px] text-gray-400 text-center mt-4">■ Campo destacado em vermelho = divergência detectada pelo motor SUIVIA</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Conciliation Engine ── */}
        <div className="w-1/2 flex flex-col bg-white relative">
          <div className="bg-gray-50 border-b text-xs font-bold text-gray-600 p-2.5">
            🧠 Análise de Conciliação Estruturada — 3-Way Match (NF × PC × Recebimento)
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28">

            {/* Cabeçalho */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3 border-b pb-2">Validação de Cabeçalho</h4>
              {[
                ['CNPJ Emitente',    '72.381.189/0001-10', true ],
                ['Valor Total',      'R$ 25.000,00',       true ],
                ['Validação SEFAZ',  'AUTORIZADA',         true ],
                ['Data de Emissão',  '04/06/2026',         true ],
              ].map(([label, val, ok]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b last:border-0 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    {val}
                    {ok ? <CheckCircle className="w-4 h-4 text-s_green" /> : <XCircle className="w-4 h-4 text-s_red" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Smart Suggestion ML */}
            <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50 relative">
              <div className="absolute -top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Sugestão IA
              </div>
              <h4 className="text-xs font-extrabold text-blue-900 mb-1">Pedido Sugerido Automaticamente</h4>
              <p className="text-xs text-blue-700 mb-3">Fornecedor identificado. Sem xPed no XML. Melhor match financeiro encontrado:</p>
              <div className="flex justify-between items-center bg-white p-3 rounded border border-blue-200">
                <div>
                  <p className="font-bold text-gray-800">PC-990432</p>
                  <p className="text-xs text-gray-500">Saldo disponível: R$ 33.500,00</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Vincular
                </button>
              </div>
            </div>

            {/* Divergência Itens */}
            <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
              <h4 className="text-xs font-extrabold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Análise de Itens — Divergências Encontradas
              </h4>
              <table className="w-full text-xs text-left rounded overflow-hidden bg-white shadow">
                <thead className="bg-gray-100 border-b text-gray-500 uppercase">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-center">Qtd PC</th>
                    <th className="p-2 text-center">Qtd NF</th>
                    <th className="p-2 text-center">Δ</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Notebook Inspiron 15</td>
                    <td className="p-2 text-center">2</td>
                    <td className="p-2 text-center">2</td>
                    <td className="p-2 text-center font-bold text-s_green">0</td>
                    <td className="p-2"><CheckCircle className="w-4 h-4 text-s_green" /></td>
                  </tr>
                  <tr className="bg-red-100">
                    <td className="p-2 font-bold text-red-800">Mouse Sem Fio Pro</td>
                    <td className="p-2 text-center font-bold text-gray-600">10</td>
                    <td className="p-2 text-center font-black text-red-700 text-base">20</td>
                    <td className="p-2 text-center font-black text-red-700">+10</td>
                    <td className="p-2"><XCircle className="w-4 h-4 text-s_red" /></td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 p-3 bg-white border border-red-200 rounded text-xs text-gray-700">
                <p className="font-bold text-red-700 mb-1">⚠ Motivo do Alerta Crítico (Severidade: HIGH)</p>
                <p>Quantidade faturada de <b>Mouse Sem Fio Pro (20 un)</b> ultrapassa o limite de tolerância de 5% sobre o saldo do PC (10 un). Divergência de 100%. Requer intervenção de Compras.</p>
              </div>
            </div>

            {/* Impostos */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-3 border-b pb-2">Validação de Impostos</h4>
              {[
                ['ICMS',  'R$ 2.250,00', 'R$ 2.250,00', true ],
                ['IPI',   'R$ 1.250,00', 'R$ 1.000,00', false],
                ['ISS',   'N/A',         'N/A',          true ],
              ].map(([t, exp, real, ok]) => (
                <div key={t} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs">
                  <span className="font-bold text-gray-700 w-12">{t}</span>
                  <span className="text-gray-500">Esperado: {exp}</span>
                  <span className={ok ? 'text-gray-700' : 'text-red-600 font-bold'}>Real: {real}</span>
                  {ok ? <CheckCircle className="w-4 h-4 text-s_green" /> : <AlertTriangle className="w-4 h-4 text-s_yellow" />}
                </div>
              ))}
            </div>

          </div>

          {/* Action Bar */}
          <div className="absolute bottom-0 w-full p-4 bg-white border-t-2 border-gray-200 grid grid-cols-4 gap-2 shadow-lg z-20">
            <button disabled className="bg-gray-200 text-gray-400 font-bold py-2.5 rounded-lg text-xs uppercase cursor-not-allowed">Aprovar Touchless</button>
            <button className="bg-s_green hover:bg-green-600 text-white font-bold py-2.5 rounded-lg text-xs uppercase shadow transition">Aprovar</button>
            <button className="bg-s_yellow hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-lg text-xs uppercase shadow transition">c/ Ressalva</button>
            <button className="bg-s_red hover:bg-red-600 text-white font-bold py-2.5 rounded-lg text-xs uppercase shadow transition">Rejeitar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
