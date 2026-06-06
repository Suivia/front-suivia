import { useNavigate } from 'react-router-dom';

export default function Inbox() {
  const navigate = useNavigate();
  const invoices = [
    { id: 1, status: 'aprovada', nf: '000.004.590', for: 'Kalunga S/A', val: 'R$ 1.250,50', score: '100%', pc: 'PC-440012' },
    { id: 2, status: 'divergente', nf: '000.004.598', for: 'Kalunga S/A', val: 'R$ 1.302,55', score: '82%', pc: 'PC-443011' },
    { id: 3, status: 'rejeitada', nf: '000.002.841', for: 'Dell Computadores', val: 'R$ 25.000,00', score: '28%', pc: 'Nenhum' },
    { id: 4, status: 'aprovada', nf: '000.003.121', for: 'Transportadora Rapida', val: 'R$ 800,20', score: '100%', pc: 'PC-447022' },
    { id: 5, status: 'aprovada', nf: '000.004.651', for: 'Microsoft Brasil', val: 'R$ 3.500,00', score: '100%', pc: 'PC-460021' },
    { id: 6, status: 'divergente', nf: '000.008.902', for: 'Armazém XYZ', val: 'R$ 8.200,00', score: '75%', pc: 'PC-460044' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm w-full h-full flex flex-col border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-800">Inbox de Notas Fiscais (Massa)</h2>
        <div className="flex gap-2">
          <button className="px-4 py-1 text-sm font-bold rounded border border-gray-400 bg-white text-gray-700">Todas</button>
          <button className="px-4 py-1 text-sm font-bold rounded bg-green-100 text-green-700 border border-green-200">Aprovadas</button>
          <button className="px-4 py-1 text-sm font-bold rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Divergentes</button>
          <button className="px-4 py-1 text-sm font-bold rounded bg-red-100 text-red-700 border border-red-200">Rejeitadas</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-s_dark text-white text-sm">
              <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Nro NF</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Fornecedor</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Valor (R$)</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Score</th>
              <th className="p-4 font-semibold uppercase tracking-wider">PC Vinculado</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  {inv.status === 'aprovada' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 uppercase">Aprovada</span>}
                  {inv.status === 'divergente' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase">Divergente</span>}
                  {inv.status === 'rejeitada' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 uppercase">Rejeitada</span>}
                </td>
                <td className="p-4 font-bold text-gray-700">{inv.nf}</td>
                <td className="p-4 text-gray-600 font-medium">{inv.for}</td>
                <td className="p-4 font-bold">{inv.val}</td>
                <td className="p-4 text-center font-bold text-gray-600">{inv.score}</td>
                <td className="p-4 text-gray-500 text-sm font-mono">{inv.pc}</td>
                <td className="p-4 text-center">
                  <button onClick={() => navigate(`/inbox/${inv.id}`)} className="text-white bg-gray-700 hover:bg-s_dark font-semibold text-xs px-4 py-2 rounded shadow">
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-s_dark flex items-center justify-between text-white rounded-b-lg">
        <span className="text-sm font-semibold text-gray-300">Resolução em Lote:</span>
        <div className="flex gap-4">
          <button className="bg-s_green hover:bg-green-600 text-white px-6 py-2 text-sm font-bold rounded shadow transition">Aprovar Lote</button>
          <button className="bg-s_red hover:bg-red-600 text-white px-6 py-2 text-sm font-bold rounded shadow transition">Rejeitar Lote</button>
        </div>
      </div>
    </div>
  );
}