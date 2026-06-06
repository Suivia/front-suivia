import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvoiceDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-inner overflow-hidden border border-gray-300">

      {/* Topbar Split Screen */}
      <div className="flex items-center justify-between p-4 bg-s_dark text-white shadow z-10 w-full shrink-0">
        <div className="flex items-center text-gray-200 hover:text-white cursor-pointer transition" onClick={() => navigate('/inbox')}>
          <ArrowLeft className="mr-3" />
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-wide">Detalhe da Nota Fiscal - Conciliação (Split-Screen)</h2>
            <p className="text-xs text-gray-400 font-mono">NF 000.002.841 | Dell Computadores | R$ 25.000,00</p>
          </div>
        </div>
        <div className="text-sm text-gray-300">Score de Match: <span className="text-s_yellow font-bold text-lg ml-2 border border-s_yellow px-2 rounded">45%</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">

        {/* Painel Esquerdo: PDF/Imagem Simulado (RF03 / RF04) */}
        <div className="w-1/2 flex flex-col bg-gray-200 border-r border-gray-300 relative overflow-hidden">
          <div className="bg-white shadow text-sm font-bold text-gray-600 p-3 border-b flex justify-between">
            <span>Visualizador de Documento Original (DANFE/PDF)</span>
            <button className="text-blue-500 font-normal hover:underline"><Search className="w-4 h-4 inline mr-1"/>Zoom</button>
          </div>
          <div className="p-8 h-full overflow-y-auto w-full relative">

            {/* O "Papel" mockado da NF */}
            <div className="bg-white shadow-xl max-w-lg mx-auto w-full h-[800px] p-8 relative ring-1 ring-gray-300">
              {/* Highlight Bounding Box mock, as per RF03 */}
              <div className="absolute top-[80px] left-[30px] w-[300px] h-[30px] bg-green-400 opacity-20 border-2 border-green-600 z-10 pointer-events-none"></div>
              <div className="absolute top-[320px] left-[30px] w-[400px] h-[30px] bg-red-400 opacity-20 border-2 border-red-600 z-10 pointer-events-none"></div>

              <h1 className="text-2xl font-bold uppercase tracking-widest text-left border-b-2 border-black pb-2 mb-4 text-gray-800">DANFE</h1>

              <div className="text-sm mb-4 border p-2 text-gray-700">
                 <strong>Nº</strong> 000.002.841 &nbsp; | &nbsp; <strong>SÉRIE:</strong> 1 &nbsp; | &nbsp; <strong>FOLHA:</strong> 1/1
              </div>

              <div className="border border-black p-2 mb-4">
                 <div className="font-bold text-xs">EMITENTE</div>
                 <div className="text-sm">Dell Computadores do Brasil Ltda. <br/> CNPJ: 72.381.189/0001-10</div>
              </div>

              <div className="border border-black p-2 mb-8 bg-gray-100 flex justify-between">
                 <div className="font-bold text-sm">VALOR TOTAL DA NOTA:</div>
                 <div className="font-bold text-lg">R$ 25.000,00</div>
              </div>

              <div className="w-full text-xs font-mono border border-black">
                <table className="w-full text-left">
                   <thead className="border-b border-black">
                     <tr><th className="p-2">CÓDIGO</th><th className="p-2">DESCRIÇÃO DO PRODUTO</th><th className="p-2">QTD</th><th className="p-2">VLR. UNIT</th></tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-gray-300"><td className="p-2">01902</td><td className="p-2">Notebook Inspiron 15</td><td className="p-2">2</td><td className="p-2">R$ 4.500,00</td></tr>
                     <tr><td className="p-2">49201</td><td className="p-2">Mouse Sem fio Pro</td><td className="p-2 font-bold text-red-600">20</td><td className="p-2">R$ 100,00</td></tr>
                   </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Painel Direito: Análise de Conciliação (Motor SUIVIA) */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden shadow-inner relative">
          <div className="bg-gray-100 shadow text-sm font-bold text-gray-600 p-3 border-b border-gray-300">
            Análise de Conciliação Estruturada (3-Way Match)
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">

            {/* Header Conciliação */}
            <div className="border rounded p-5 bg-white shadow-sm">
               <h4 className="font-bold text-sm mb-4 text-gray-700 uppercase tracking-widest border-b pb-2">Validação de Cabeçalho</h4>
               <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-gray-600">CNPJ Emitente</span>
                  <span className="font-bold text-gray-800">72.381.189/0001-10 <CheckCircle className="inline ml-2 text-s_green w-5 h-5"/></span>
               </div>
               <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-gray-600">Valor Total Mapeado</span>
                  <span className="font-bold text-gray-800">R$ 25.000,00 <CheckCircle className="inline ml-2 text-s_green w-5 h-5"/></span>
               </div>
               <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-gray-600">Validação SEFAZ</span>
                  <span className="font-bold text-gray-800 bg-s_green text-white px-2 py-1 rounded text-xs">Autorizada</span>
               </div>
            </div>

            {/* Smart Suggestion - IA */}
            <div className="border-2 border-blue-400 rounded p-5 bg-blue-50 shadow-sm relative">
               <div className="absolute top-0 right-0 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-bl">Machine Learning</div>
               <h4 className="font-bold text-sm mb-2 text-blue-900 flex items-center">
                 Sugestão Inteligente de Pedido (Sem xPed no XML)
               </h4>
               <p className="text-xs text-blue-800 mb-4">O sistema detectou este fornecedor e sugere o pedido em aberto com melhor fit financeiro:</p>

               <div className="flex justify-between items-center bg-white p-3 border border-blue-200 rounded">
                 <div>
                    <span className="font-bold text-gray-800 block">Pedido: PC-990432</span>
                    <span className="text-xs font-semibold text-gray-500">Saldo atual: R$ 33.500,00</span>
                 </div>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded shadow transition">Vincular a esta NF</button>
               </div>
            </div>

            {/* Itens Analysis (The Match Engine) */}
            <div className="border-2 rounded p-5 bg-red-50 border-red-300 relative shadow-sm">
               <h4 className="font-bold text-sm mb-3 text-red-900 flex items-center">
                 <AlertTriangle className="mr-2 w-5 h-5"/> Análise de Itens (Divergências Encontradas)
               </h4>
               <table className="w-full text-left text-xs bg-white rounded overflow-hidden shadow">
                 <thead className="bg-gray-100 text-gray-600 border-b">
                   <tr>
                     <th className="p-3">Item Extrato</th>
                     <th className="p-3 text-center">Qtd ERP</th>
                     <th className="p-3 text-center">Qtd NF</th>
                     <th className="p-3">Status Item</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b"><td className="p-3 font-medium text-gray-800">Notebook Inspiron 15</td><td className="p-3 text-center">2</td><td className="p-3 text-center">2</td><td className="p-3 text-s_green font-bold"><CheckCircle className="w-4 h-4"/></td></tr>
                   <tr className="bg-red-100"><td className="p-3 font-medium text-red-900">Mouse Sem fio Pro</td><td className="p-3 text-center font-bold text-gray-500">10</td><td className="p-3 text-center font-bold text-red-700 text-lg">20</td><td className="p-3 text-red-700 font-bold"><XCircle className="w-4 h-4"/></td></tr>
                 </tbody>
               </table>
               <div className="mt-4 p-3 bg-white border border-red-200 rounded">
                 <p className="text-sm text-red-700 font-semibold mb-1">Motivo do Alerta Crítico:</p>
                 <p className="text-xs text-gray-700">A quantidade faturada de 'Mouse Sem fio Pro' (20 un) <b>ultrapassa o limite de tolerância de 5%</b> do saldo do pedido (10 un). Requer intervenção de compras.</p>
               </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 w-full p-4 bg-white border-t-2 border-gray-200 flex gap-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
             <button className="flex-1 bg-gray-300 text-gray-500 font-bold py-3 rounded shadow cursor-not-allowed uppercase text-sm tracking-wide" disabled>Aprovar Touchless</button>
             <button className="flex-1 bg-s_yellow hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded shadow transition uppercase text-sm tracking-wide">Aprovar com Ressalva</button>
             <button className="flex-1 bg-s_red hover:bg-red-600 text-white font-bold py-3 rounded shadow transition uppercase text-sm tracking-wide">Rejeitar Imediatamente</button>
          </div>

        </div>
      </div>
    </div>
  );
}